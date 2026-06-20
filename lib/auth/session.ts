import "server-only";

import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { REFRESH_TOKEN_TTL_SECONDS } from "@/lib/auth/constants";

// The refresh token is an opaque random string handed to the client in an
// HTTP-only cookie. Only its SHA-256 hash is stored, so a database leak does
// not expose usable tokens. Each Session row == one refresh token.

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface CreatedSession {
  sessionId: string;
  refreshToken: string;
  expiresAt: Date;
}

export async function createSession(opts: {
  userId: string;
  userAgent?: string | null;
  ip?: string | null;
}): Promise<CreatedSession> {
  const refreshToken = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  const session = await prisma.session.create({
    data: {
      userId: opts.userId,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: opts.userAgent ?? null,
      ip: opts.ip ?? null,
      expiresAt,
    },
  });

  return { sessionId: session.id, refreshToken, expiresAt };
}

// Validate an incoming refresh token and rotate it (one-time use). Returns the
// new token + the owning user, or null if the token is unknown/expired/revoked.
export async function rotateSession(refreshToken: string): Promise<
  | {
      sessionId: string;
      refreshToken: string;
      expiresAt: Date;
      user: { id: string; role: "ADMIN" | "CLIENT" };
    }
  | null
> {
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: hashToken(refreshToken) },
    include: { user: { select: { id: true, role: true } } },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return null;
  }

  const newToken = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: hashToken(newToken), expiresAt },
  });

  return {
    sessionId: session.id,
    refreshToken: newToken,
    expiresAt,
    user: session.user,
  };
}

export async function revokeSession(refreshToken: string): Promise<void> {
  const hash = hashToken(refreshToken);
  // Soft-delete (revokedAt) so the row remains for audit/history.
  await prisma.session.updateMany({
    where: { refreshTokenHash: hash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeSessionById(sessionId: string): Promise<void> {
  await prisma.session
    .update({ where: { id: sessionId }, data: { revokedAt: new Date() } })
    .catch(() => undefined);
}
