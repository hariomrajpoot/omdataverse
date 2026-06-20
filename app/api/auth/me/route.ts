import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken, signAccessToken } from "@/lib/auth/jwt";
import {
  readAccessToken,
  readRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { rotateSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const userSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  profile: {
    select: {
      firstName: true,
      lastName: true,
      avatarUrl: true,
      bio: true,
      phone: true,
      company: true,
    },
  },
} as const;

// Persistent session check. Self-healing: if the access token has expired but
// the DB-backed refresh token is still valid, it transparently rotates and
// re-issues cookies before returning the user — so the client stays logged in.
export async function GET() {
  let claims = await verifyAccessToken(await readAccessToken());

  if (!claims) {
    const refreshToken = await readRefreshToken();
    if (refreshToken) {
      const rotated = await rotateSession(refreshToken);
      if (rotated) {
        const accessToken = await signAccessToken({
          sub: rotated.user.id,
          role: rotated.user.role,
          sid: rotated.sessionId,
        });
        await setAuthCookies({ accessToken, refreshToken: rotated.refreshToken });
        claims = { sub: rotated.user.id, role: rotated.user.role, sid: rotated.sessionId };
      }
    }
  }

  if (!claims) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: userSelect,
  });

  if (!user) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user });
}
