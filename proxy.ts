import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection for the dashboard (Next.js 16 proxy — the middleware
 * convention was renamed to proxy in this version).
 *
 * Cheap cookie-presence check so unauthenticated requests never reach a
 * dashboard render; the dashboard layout then performs the authoritative
 * session + role verification against the database.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.endsWith("better-auth.session_token"));

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
