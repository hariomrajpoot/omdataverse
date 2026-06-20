import "server-only";

import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/lib/auth/constants";

// Cookie helpers usable from Route Handlers and Server Actions (where the
// cookie store is writable). HTTP-only so tokens are never exposed to JS.

const baseOptions = {
  httpOnly: true as const,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setAuthCookies(opts: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, opts.accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  store.set(REFRESH_TOKEN_COOKIE, opts.refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, "", { ...baseOptions, maxAge: 0 });
  store.set(REFRESH_TOKEN_COOKIE, "", { ...baseOptions, maxAge: 0 });
}

export async function readRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function readAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}
