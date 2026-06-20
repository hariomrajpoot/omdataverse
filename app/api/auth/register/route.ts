import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { createSession } from "@/lib/auth/session";
import { setAuthCookies } from "@/lib/auth/cookies";
import { getClientIp } from "@/features/contact/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { email, password, firstName, lastName } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);

    // First registered account becomes ADMIN; everyone else is CLIENT.
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "CLIENT";

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        profile: {
          create: {
            firstName: firstName || null,
            lastName: lastName || null,
          },
        },
      },
      select: { id: true, email: true, role: true },
    });

    const session = await createSession({
      userId: user.id,
      userAgent: req.headers.get("user-agent"),
      ip: getClientIp(req.headers),
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      role: user.role,
      sid: session.sessionId,
    });

    await setAuthCookies({
      accessToken,
      refreshToken: session.refreshToken,
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    console.error("Registration error:", err);
    return NextResponse.json(
      { ok: false, error: "Registration failed." },
      { status: 500 },
    );
  }
}
