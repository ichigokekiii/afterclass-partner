import { NextRequest, NextResponse } from "next/server";
import { isMobileOrTabletRequest } from "./domain/device-gate";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname === "/manifest.json" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const allowed = isMobileOrTabletRequest({
    userAgent: request.headers.get("user-agent"),
    secChUaMobile: request.headers.get("sec-ch-ua-mobile"),
    secChUaPlatform: request.headers.get("sec-ch-ua-platform"),
  });

  if (!allowed && pathname !== "/blocked") {
    const url = request.nextUrl.clone();
    url.pathname = "/blocked";
    return NextResponse.rewrite(url);
  }

  if (allowed && pathname === "/blocked") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|manifest.json|favicon.ico).*)"],
};
