import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";
import "./curosal.css";
import AppProviders from "../providers/AppProviders";

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
    <html lang="en" className="scrollbar-custom">
      <body
        className={`${caveat.variable} ${nunito.variable} antialiased min-h-screen flex flex-col`}
      >
          <AppProviders>
            {children}
          </AppProviders>
      </body>
    </html>
  );
}
