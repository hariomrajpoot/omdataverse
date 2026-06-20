import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";

// Next 16 "proxy" (formerly middleware): coarse, fast route guarding at the
// edge using the access-token JWT (no DB access is available here). Fine-grained
// checks + token self-healing happen in route handlers / the client
// AuthProvider, whose silent-refresh timer keeps the access token fresh so
// valid sessions rarely get bounced here.

const ADMIN_PREFIX = "/admin";
const CLIENT_PREFIXES = ["/account"];

function loginRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const claims = await verifyAccessToken(token);

  // Admin area: must be authenticated AND ADMIN.
  if (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) {
    if (!claims) return loginRedirect(req);
    if (claims.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Client area: any authenticated user.
  if (CLIENT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!claims) return loginRedirect(req);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Only run on protected sections; static assets and public pages skip it.
  matcher: ["/admin/:path*", "/account/:path*"],
};
