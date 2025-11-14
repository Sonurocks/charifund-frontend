"use cliet";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMenu from "./NavbarMenu";
import NavbarActions from "./NavbarActions";
import NavbarMobile from "./NavbarMobile";
import Image from "next/image";
import { useNavItems } from "@/src/hooks/web/useNavItems";
import { logo } from "@/public/assets";


const Navbar = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backdropDone, setBackdropDone] = useState(false);
  const [drawerDelay, setDrawerDelay] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const DRAWER_ANIMATION_DELAY = 0;
  const route = useRouter();
  const navItems = useNavItems();

  // Reset backdrop animation flag on open/close
  useEffect(() => {
    if (mobileMenuOpen) {
      const timer = setTimeout(() => {
        setBackdropDone(true);
        setDrawerDelay(false);
      }, DRAWER_ANIMATION_DELAY * 1000);
      return () => clearTimeout(timer);
    } else {
      setBackdropDone(false);
      setDrawerDelay(true);
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="w-full flex items-center justify-between py-4 relative">
      {/* Logo */}
      <div className="h-15 w-28   lg:h-14 lg:w-56 relative cursor-pointer "
        onClick={() => route.push("/")}
      >
        <Image src={logo.src} alt="Logo" fill className="object-contain" />
      </div>

      {/* Desktop Menu */}
      <NavbarMenu
        navItems={navItems}
        open={open}
        setOpen={setOpen}
        route={route}
      />
      <NavbarActions
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {(mobileMenuOpen || isClosing) && (
          <NavbarMobile
          navItems={navItems}
            isClosing={isClosing}
            backdropDone={backdropDone}
            drawerDelay={DRAWER_ANIMATION_DELAY}
            open={open}
            setOpen={setOpen}
            setMobileMenuOpen={setMobileMenuOpen}
        
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;