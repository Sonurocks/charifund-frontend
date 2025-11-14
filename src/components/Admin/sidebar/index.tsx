"use client";
import { logo } from "@/public/assets";
import { sidebarAd } from "@/src/utils/AdminSidebarData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.3, type: "tween" }}
      className="bg-white rounded-r-3xl shadow-md sticky top-0 bottom-0 left-0 flex flex-col"
    >
      <div className="flex flex-col items-center pb-6 pt-10">
        {isOpen ? (
          <Image
            src={logo.src}
            alt="logo"
            width={180}
            height={80}
            className="mb-6 h-10 w-auto md:h-12 md:w-auto lg:h-14 lg:w-auto object-contain -ml-12"
          />
        ) : (
          <div className="h-10" />
        )}
      </div>

      <div className="flex flex-col w-full font-medium flex-grow border-t border-gray-200 relative">
        {sidebarAd.map((item, i) => {
          const isActive = lastSegment === item.nav;

          return (
            <Link href={item.link} key={i} className="relative">
              <motion.div
                whileHover={{
                  x: isOpen ? 8 : 0,
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`py-4 cursor-pointer pl-5 pr-8 flex gap-2 items-center border-b border-gray-200 relative`}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-primaryColor rounded-r-md -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>

                {item.icon && (
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-white" : "text-black"
                    }`}
                  />
                )}
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={isActive ? "text-white" : "text-black"}
                  >
                    {item.lable}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.15, backgroundColor: "#f3f3f3" }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-fit h-fit absolute top-20 right-[-15px] cursor-pointer bg-white shadow-md p-2 rounded-full"
      >
        <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
          <MdArrowForwardIos className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminSideBar;
