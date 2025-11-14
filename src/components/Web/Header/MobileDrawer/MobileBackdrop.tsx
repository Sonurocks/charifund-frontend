'use client';
import { MobileBackdropProps } from "@/src/types/web/navbar";
import { motion } from "framer-motion";



export const MobileBackdrop = ({ isClosing, drawerDelay}: MobileBackdropProps) => {
  return (
    <motion.div
      key="backdrop"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 0.8 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: isClosing ? 0.9 : drawerDelay ? 0.9 : 0,
        ease: "easeInOut",
      }}
      className="fixed inset-0 bg-black z-40"
    />
  );
};
