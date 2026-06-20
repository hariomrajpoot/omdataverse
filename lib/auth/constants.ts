// Shared auth constants. Safe to import from both Edge (middleware) and Node.

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const ACCESS_TOKEN_TTL_SECONDS = Number(
  process.env.ACCESS_TOKEN_TTL_SECONDS ?? 60 * 15, // 15 minutes
);

export const REFRESH_TOKEN_TTL_SECONDS = Number(
  process.env.REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30, // 30 days
);

export type AppRole = "ADMIN" | "CLIENT";

export interface AccessTokenClaims {
  sub: string; // user id
  role: AppRole;
  sid: string; // session id (refresh-token row)
}
