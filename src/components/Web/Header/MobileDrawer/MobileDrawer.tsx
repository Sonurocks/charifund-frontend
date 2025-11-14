'use client';
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { socialIcons } from "@/src/staticResource";
import MobileDropdownItem from "./MobileDropdownItem";
import { logo } from "@/public/assets";
import { MobileDrawerProps } from "@/src/types/web/navbar";
import LanguageSwitcher from "@/src/components/UI/web/LanguageSwitcher";
import Button from "@/src/components/UI/web/Buttons/Button";


export const MobileDrawer = ({
  drawerDelay,
  isClosing,
  open,
  setOpen,
  setMobileMenuOpen,
   navItems,
}: MobileDrawerProps) => {


  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{
        duration: 0.6,
        delay: !isClosing ? drawerDelay : 0,
        ease: 'easeInOut',
      }}
      className="fixed top-0 left-0 h-full w-full md:w-104 bg-white shadow-lg z-50 pt-6 pb-20 xl:hidden overflow-y-auto overflow-x-hidden"
    >

      {/* Close Button */}
      <div className="flex justify-end mr-4 text-brown ">
        <button onClick={() => setMobileMenuOpen(false)}>
          <Icon icon="line-md:menu-to-close-alt-transition" className="font-extrabold" width={34} height={34} />
        </button>
      </div>

      <div className="ps-8 my-10">
        <motion.img src={logo.src} alt="Logo" className="h-10 w-auto object-contain -ml-3" />
      </div>

       

      {/* Navigation Items with Dropdowns */}
      <ul>
        {navItems.map((item, i) => (
          <MobileDropdownItem
            key={i}
            item={item}
            open={open}
            setOpen={setOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        ))}
      </ul>

       

     {/* <div className="px-8 mt-5 flex justify-between items-center gap-5 "> */}
      <div className="sticky top-0 z-30 bg-white px-8 py-4 flex flex-col gap-3 border-b border-gray-200">
       
        <LanguageSwitcher rounded="rounded-md" />
        <div className="w-fit">

        <Button text="Donate Now" rounded="rounded-md" />
        </ div>
      </div>
      <div className="flex  items-center justify-center space-x-4 mt-10 ">

        {socialIcons.map(({ icon, label, link }) => (
          <motion.a
            key={label}
            href={link}
            aria-label={label}
            whileHover={{ scale: 1, color: "#F3BB11" }}
            className="cursor-pointer bg-dark-green p-3 rounded-full text-white"
          >
            <Icon icon={icon} className="w-5 h-5" />
          </motion.a>
        ))}
      </div>

    </motion.div>
  );
};
