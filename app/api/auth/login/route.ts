import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { createSession } from "@/lib/auth/session";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getClientIp, rateLimit } from "@/features/contact/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);

  // Throttle credential-stuffing: 10 attempts / 10 min / IP.
  const rl = rateLimit({ key: `login:${ip}`, limit: 10, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password." },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, passwordHash: true },
  });

  // Use a uniform error + always run a hash compare to avoid leaking which
  // emails exist (timing/enumeration). OAuth-only accounts have no password
  // hash — they must use "Continue with Google".
  const DUMMY_HASH = "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinv";
  const passwordOk = user?.passwordHash
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, DUMMY_HASH);

  if (!user || !user.passwordHash || !passwordOk) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password." },
      { status: 401 },
    );
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

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
