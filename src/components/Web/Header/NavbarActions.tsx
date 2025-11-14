"use client";

import Button from "../../UI/web/Buttons/Button";
import { RootState } from "@/src/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { NavbarActionsProps } from "@/src/types/web/navbar";
import LanguageSwitcher from "../../UI/web/LanguageSwitcher";

const NavbarActions = ({  setMobileMenuOpen, mobileMenuOpen }: NavbarActionsProps) => {
  

    const navScrolled = useSelector((state: RootState) => state.navScroll.navScrolled);
  return (
    <div className="flex items-center gap-4">
      {/* Language Switcher */}
      {navScrolled &&(
        <div className="font-bold hidden md:block">
        <LanguageSwitcher paddingx="px-6 py-4  md:px-4 lg:px-6" paddingy="md:py-[10px] lg:py-4" />
      </div>
      )}

      {/* Donate Button */}
      <Link href="/donate-us" className="hidden md:block">
        <Button text="Donate Now" paddingx="md:px-3  lg:px-8" paddingy="md:py-[10px] lg:py-4" />
      </Link>

      {/* Menu Icon (Mobile) */}
      <div className="xl:hidden block">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-teal-600">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" transform="rotate(180)">
            <rect x="4" y="8" width="16" height="2" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="4" y="15" width="24" height="1.5" rx="0.75" fill="currentColor"/>
            <rect x="4" y="22" width="20" height="1" rx="0.5" fill="currentColor" opacity="0.7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}


export default NavbarActions;
