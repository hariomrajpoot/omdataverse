import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readAccessToken } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import type { AppRole } from "@/lib/auth/constants";

export interface CurrentUser {
  id: string;
  email: string;
  role: AppRole;
  profile: {
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    phone: string | null;
    company: string | null;
  } | null;
}

// Reads + verifies the access-token JWT and loads the user. Returns null when
// unauthenticated. Safe to call from Server Components, layouts, route handlers.
//
// Note: a Server Component cannot refresh an expired access token (it cannot
// write cookies). Silent refresh happens in the client AuthProvider / the
// /api/auth/me + /api/auth/refresh route handlers, which run before/around
// rendering. Here we simply treat an expired access token as logged-out.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await readAccessToken();
  const claims = await verifyAccessToken(token);
  if (!claims) return null;

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: {
      id: true,
      email: true,
      role: true,
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
    },
  });

  return user;
}

// Route guard for Server Components/layouts: redirect to login when absent.
export async function requireUser(redirectTo = "/login"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  return user;
}

// Role guard: ensures the user holds one of the allowed roles.
export async function requireRole(
  roles: AppRole | AppRole[],
  redirectTo = "/login",
): Promise<CurrentUser> {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const user = await getCurrentUser();
  if (!user) redirect(redirectTo);
  if (!allowed.includes(user.role)) redirect("/account");
  return user;
}
