"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import FadeInUp from "@/src/animations/FadeInUp";
import { NavbarDropdown } from "./Dropdown/NavbarDropdown";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { NavbarMenuProps } from "@/src/types/web/navbar";


const NavbarMenu = ({ navItems, open, setOpen, route }: NavbarMenuProps) => {
  const pathname = usePathname();
  const {t} = useTranslation();

  return (
    <ul className="hidden xl:flex items-center gap-x-6 px-10 rounded-full font-medium text-black relative bg-yellow">
      {navItems.map((item, i) => {
        const isActive = pathname === item.href;
        return (
          <li
            key={i}
            className="relative cursor-pointer"
            onMouseEnter={() => setOpen(item.label)}
            onMouseLeave={() => setOpen(null)}
          >
            <div
              className={`flex items-center gap-1 font-semibold font-nunito py-[18px] transition-colors duration-200
            ${isActive ? "text-brown" : "text-foreground/90 hover:text-"}`}
              onClick={() => {
                if (item?.href) route.push(item?.href);
              }}
            >
              {t(item.label)}
              {item.dropdown && (
                <motion.span
                  animate={{ rotate: open === item.label ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon icon="mdi:chevron-down" width={16} height={16} />
                </motion.span>
              )}
            </div>

            {/* Dropdown */}
            {item.dropdown && open === item.label && (
              <FadeInUp initialYExis={30}>
                <NavbarDropdown options={item.dropdown} />
              </FadeInUp>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default NavbarMenu;
