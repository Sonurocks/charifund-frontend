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
  title: "GiveSphere | Empowering Communities & Transparent Giving",
  description: "A modern, full-stack crowdfunding and NGO fundraising management platform featuring real-time donations, 80G certificate generation, donor management, and campaign analytics.",
  icons: {
    icon: [
      { url: "/favicon-16x16.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-32x32.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon-48x48.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-64x64.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/favicon-180x180.ico", sizes: "180x180", type: "image/x-icon" },
      { url: "/favicon-192x192.ico", sizes: "192x192", type: "image/x-icon" },
      { url: "/favicon-512x512.ico", sizes: "512x512", type: "image/x-icon" },
    ],
  },
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
