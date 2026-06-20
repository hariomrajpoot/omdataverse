import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth/jwt";
import { createSession } from "@/lib/auth/session";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getClientIp, rateLimit } from "@/features/contact/lib/rateLimit";

export const runtime = "nodejs";

function getClientId(): string | undefined {
  return process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
}

// Verifies a Google ID token (from the client GIS button), then finds/creates
// the user and issues our standard access + refresh cookies.
export async function POST(req: Request) {
  const clientId = getClientId();
  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: "Google sign-in is not configured." },
      { status: 500 },
    );
  }

  // Throttle abuse.
  const ip = getClientIp(req.headers);
  const rl = rateLimit({ key: `google:${ip}`, limit: 20, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let credential: string | undefined;
  try {
    ({ credential } = await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!credential) {
    return NextResponse.json({ ok: false, error: "Missing Google credential." }, { status: 400 });
  }

  // Verify the ID token's signature, audience, and expiry against Google.
  const oauth = new OAuth2Client(clientId);
  let payload;
  try {
    const ticket = await oauth.verifyIdToken({ idToken: credential, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid Google token." }, { status: 401 });
  }

  if (!payload?.email || !payload.email_verified || !payload.sub) {
    return NextResponse.json(
      { ok: false, error: "Your Google account email is not verified." },
      { status: 401 },
    );
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;

  try {
    // Match by Google id first, then by email (link an existing password account).
    const existing = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
      select: { id: true, email: true, role: true, googleId: true },
    });

    let user: { id: string; email: string; role: "ADMIN" | "CLIENT" };

    if (existing) {
      // Link the Google id if not already, and backfill profile pic/name only
      // if the profile doesn't exist yet (never overwrite user-edited values).
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          googleId: existing.googleId ?? googleId,
          profile: {
            upsert: {
              create: {
                firstName: payload.given_name ?? null,
                lastName: payload.family_name ?? null,
                avatarUrl: payload.picture ?? null,
              },
              update: {},
            },
          },
        },
      });
      user = { id: existing.id, email: existing.email, role: existing.role };
    } else {
      // First account ever becomes ADMIN (matches the password register flow).
      const role = (await prisma.user.count()) === 0 ? "ADMIN" : "CLIENT";
      const created = await prisma.user.create({
        data: {
          email,
          googleId,
          role,
          profile: {
            create: {
              firstName: payload.given_name ?? null,
              lastName: payload.family_name ?? null,
              avatarUrl: payload.picture ?? null,
            },
          },
        },
        select: { id: true, email: true, role: true },
      });
      user = created;
    }

    const session = await createSession({
      userId: user.id,
      userAgent: req.headers.get("user-agent"),
      ip,
    });
    const accessToken = await signAccessToken({
      sub: user.id,
      role: user.role,
      sid: session.sessionId,
    });
    await setAuthCookies({ accessToken, refreshToken: session.refreshToken });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json({ ok: false, error: "Sign-in failed." }, { status: 500 });
  }
}
