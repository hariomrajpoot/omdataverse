import { SignJWT, jwtVerify } from "jose";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  type AccessTokenClaims,
} from "@/lib/auth/constants";

// `jose` is used (not `jsonwebtoken`) because it runs in the Edge runtime,
// which is where Next.js middleware executes.

function getSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_ACCESS_SECRET is missing or too short. Set a long random value in your environment.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(
  claims: AccessTokenClaims,
): Promise<string> {
  return new SignJWT({ role: claims.role, sid: claims.sid })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getSecret());
}

// Returns the verified claims, or null if the token is missing/invalid/expired.
export async function verifyAccessToken(
  token: string | undefined | null,
): Promise<AccessTokenClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "CLIENT") ||
      typeof payload.sid !== "string"
    ) {
      return null;
    }
    return { sub: payload.sub, role: payload.role, sid: payload.sid };
  } catch {
    return null;
  }
}
