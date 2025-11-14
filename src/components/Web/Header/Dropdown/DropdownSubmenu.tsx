"use client";
import { AnimatePresence } from "framer-motion";

import { DropdownOptionItem } from "./DropdownOptionItem";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { Icon } from "@iconify/react";
import { DropdownSubmenuProps } from "@/src/types/web/navbar";


export const DropdownSubmenu = ({
  parent,
  open,
  displayLabel,
  hovered,
  setHovered,
  setOpen,
}: DropdownSubmenuProps) => {
  if (!parent.children) return null;

  return (
    <AnimatePresence>
      {open === displayLabel && (
        <AnimatedReveal
          direction="up"
          distance={8}
          duration={0.4}
          className="absolute top-0 left-full bg-white rounded-md shadow-lg py-2 w-44"
        >
          <Icon
            icon="bxs:left-arrow"
            className="absolute top-3 -left-4 size-5 text-brown"
          />

          {parent.children.map((sub) => (
            <DropdownOptionItem
              key={sub.label || sub.name}
              opt={sub}
              open={open}
              setOpen={setOpen}   
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </AnimatedReveal>
      )}
    </AnimatePresence>
  );
};
