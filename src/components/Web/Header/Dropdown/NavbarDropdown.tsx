"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { DropdownOptionItem } from "./DropdownOptionItem";
import { Icon } from "@iconify/react/dist/iconify.js";
import { NavbarDropdownProps } from "@/src/types/web/navbar";

export const NavbarDropdown = ({ options }: NavbarDropdownProps) => {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full mt-0 bg-white rounded-md shadow-lg py-2 z-50 w-48 "
    >
      <Icon icon="bxs:up-arrow" className="absolute -top-0 left-5 size-4 text-brown" />
      {options.map((opt) => (
        <DropdownOptionItem
          key={opt.label || opt.name}
          opt={opt}
          open={open}
          setOpen={setOpen}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </motion.div>
  );
};
