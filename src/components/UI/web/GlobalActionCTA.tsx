"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { socialIcons } from "@/src/static-resource/web";

const GlobalActionCTA = () => {
  const pathname = usePathname();

  // Hide on admin routes or auth routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/forgot-password") || pathname?.startsWith("/reset-password")) {
    return null;
  }

  return (
    <div className="fixed top-2/5 right-0 -translate-y-1/2 z-[100] flex flex-col items-center bg-dark-green py-4 px-3 rounded-l-xl shadow-lg gap-5">
      {socialIcons.map(({ icon, label, link }) => (
        <a
          key={label}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="cursor-pointer text-white hover:text-yellow transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2 focus:ring-offset-dark-green rounded-sm"
        >
          <Icon icon={icon} className="w-[18px] h-[18px]" />
        </a>
      ))}
    </div>
  );
};

export default GlobalActionCTA;
