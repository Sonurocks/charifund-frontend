// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes (accessible without auth)
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/cookie-policy",
    "/privacy-policy",
  ];

  // If accessing a public route → allow
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // If accessing admin page but not logged in → redirect to login
  if (pathname.startsWith("/admin") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to go to public pages → redirect to /admin
  if (token && (pathname === "/" || publicRoutes.includes(pathname))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Continue to requested page
  return NextResponse.next();
}

// Only run middleware on relevant routes
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|static).*)"],
};
