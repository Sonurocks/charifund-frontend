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

export const metadata: Metadata = {
  title: "charifund-frontend",
  description: "development environment for charifund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section
      className={`${caveat.variable} ${nunito.variable} antialiased min-h-screen flex flex-col`}
    >
      <main>{children}</main>
    </section >
  );
}
