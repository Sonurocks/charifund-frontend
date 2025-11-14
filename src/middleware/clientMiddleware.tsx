"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ClientRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const token = Cookies.get("token"); 

  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/blog",
    "/events",
    "/campaigns",
    "/donate",
    "/privacy-policy",
    "/cookie-policy",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  useEffect(() => {
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (token && isPublicRoute) {
      router.replace("/admin");
      return;
    }

    if (!token && pathname.startsWith("/admin")) {
      router.replace("/login");
      return;
    }
  }, [pathname, token, router]);

  return null;
}
