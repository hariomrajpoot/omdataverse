import { NextResponse } from "next/server";
import { clearAuthCookies, readRefreshToken } from "@/lib/auth/cookies";
import { revokeSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const refreshToken = await readRefreshToken();
  if (refreshToken) {
    await revokeSession(refreshToken);
  }
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
