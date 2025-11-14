"use client";
import { MobileBackdrop } from "./MobileDrawer/MobileBackdrop";
import { MobileDrawer } from "./MobileDrawer/MobileDrawer";
import { NavbarMobileProps } from "@/src/types/web/navbar";

const NavbarMobile = ({
  isClosing,
  backdropDone,
  drawerDelay,
  open,
  setOpen,
  setMobileMenuOpen,
   navItems,
}: NavbarMobileProps) => (
  <>
    <MobileBackdrop isClosing={isClosing} drawerDelay={drawerDelay} />
    {(backdropDone || isClosing) && (
      <MobileDrawer
        drawerDelay={drawerDelay}
        isClosing={isClosing}
        open={open}
        setOpen={setOpen}
        setMobileMenuOpen={setMobileMenuOpen}
         navItems={navItems}
      />
    )}
  </>
);

export default NavbarMobile;