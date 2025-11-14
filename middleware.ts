// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only /admin needs authentication
const protectedRoutes = ["/admin"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token"); // read token from cookie
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users from /admin
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optionally: redirect logged-in users away from login/signup
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Continue to requested page
  return NextResponse.next();
}

// Apply middleware only to /admin, /login, /signup
export const config = {
  matcher: ["/admin/:path*", "/login", "/signup"],
};
