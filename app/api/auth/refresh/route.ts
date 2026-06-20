import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  readRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { signAccessToken } from "@/lib/auth/jwt";
import { rotateSession } from "@/lib/auth/session";

export const runtime = "nodejs";

// Exchanges a valid refresh token for a fresh access token, rotating the
// refresh token (one-time use) to limit replay if a token leaks.
export async function POST() {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) {
    return NextResponse.json({ ok: false, error: "No session." }, { status: 401 });
  }

  const rotated = await rotateSession(refreshToken);
  if (!rotated) {
    await clearAuthCookies();
    return NextResponse.json(
      { ok: false, error: "Session expired." },
      { status: 401 },
    );
  }

  const accessToken = await signAccessToken({
    sub: rotated.user.id,
    role: rotated.user.role,
    sid: rotated.sessionId,
  });

  await setAuthCookies({ accessToken, refreshToken: rotated.refreshToken });

  return NextResponse.json({ ok: true });
}
