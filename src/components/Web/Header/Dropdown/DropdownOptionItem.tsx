"use client";
import { Icon } from "@iconify/react";

import { DropdownSubmenu } from "./DropdownSubmenu";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { DropdownOptionItemProps } from "@/src/types/web/navbar";

export const DropdownOptionItem = ({
  opt,
  open,
  setOpen,
  hovered,
  setHovered,
}: DropdownOptionItemProps) => {
  const pathname = usePathname();
  const hasChildren = opt.children && opt.children.length > 0;
  const displayLabel = opt.label || opt.name || "Item";
  const isActive = pathname === opt.href; 
  const isHovered = hovered === displayLabel || isActive; 
  const {t} = useTranslation();

  return (
    <div
      key={displayLabel}
      className="relative group border-b border-gray-100 last:border-b-0"
      onMouseEnter={() => {
        setHovered(displayLabel);
        if (hasChildren) setOpen(displayLabel);
      }}
      onMouseLeave={() => {
        setHovered(null);
        if (hasChildren) setOpen(null);
      }}
    >
      {/* Standard dropdown link */}
      <a
        href={opt.href || "#"}
        className={`flex items-center justify-between gap-2 px-4 py-2 transition-colors duration-200 relative
          ${isHovered ? "text-brown " : "text-foreground/90 hover:text-brown"}`}
      >
        {/* Left dash icon animation */}
        <AnimatedReveal
          direction="left"
          distance={8}
          duration={0.2}
          animate={isHovered ? { x: 0, opacity: 1 } : { x: -8, opacity: 0 }}
          className="absolute left-2"
        >
          <Icon icon="mdi:minus" width="16" height="16" />
        </AnimatedReveal>

        <AnimatedReveal
          direction="right"
          distance={10}
          duration={0.2}
          className="flex-1"
          animate={isHovered ? { x: 10 } : { x: 0 }}
        >
          {t(displayLabel)}
        </AnimatedReveal>

        {hasChildren && (
          <Icon icon="mdi:chevron-right" width="16" height="16" />
        )}
      </a>

      {/* Nested dropdown */}
      <DropdownSubmenu
        parent={opt}
        open={open}
        displayLabel={displayLabel}
        hovered={hovered}
        setHovered={setHovered}
        setOpen={setOpen}
      />
    </div>
  );
};
