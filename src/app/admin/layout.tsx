import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "@/src/app/globals.css";
import AdminSideBar from "@/src/components/Admin/sidebar";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "charifund-frontend | Admin",
  description: "development environment for charifund admin panel",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section
      className={`${caveat.variable} ${nunito.variable} antialiased min-h-screen bg-gray-50`}
    >
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </section>
  );
}
