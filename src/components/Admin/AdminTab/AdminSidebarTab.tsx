
"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { logo } from "@/public/assets";
import { AdminSideBarTabProps } from "@/src/types/admin";
import { sidebarAd } from "@/src/utils/AdminSidebarData";

//  Dynamically import heavy libraries
const MotionDiv = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);
const AnimatePresence = dynamic(() =>
  import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

//  Dynamically import icons
const MdArrowForwardIos = dynamic(() =>
  import("react-icons/md").then((mod) => mod.MdArrowForwardIos),
  { ssr: false }
);
const MdMenu = dynamic(() =>
  import("react-icons/md").then((mod) => mod.MdMenu),
  { ssr: false }
);

const AdminSideBarTab = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
}: AdminSideBarTabProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { t } = useTranslation();

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center px-4 py-3 bg-white shadow-md md:hidden z-50">
          <Image src={logo.src} alt="logo" width={120} height={40} />
          <button onClick={() => setMobileDrawerOpen(true)} className="text-2xl">
            <MdMenu />
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setMobileDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobile && mobileDrawerOpen && (
          <MotionDiv
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg rounded-r-3xl flex flex-col"
          >
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileDrawerOpen(false)} className="text-xl">
                <MdArrowForwardIos />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <Image src={logo.src} alt="logo" width={140} height={40} />
            </div>

            <div className="flex flex-col">
              {sidebarAd.map((item, i) => {
                const isActive = activeTab === item.nav;
                return (
                  <MotionDiv
                    key={i}
                    onClick={() => {
                      setActiveTab(item.nav);
                      setMobileDrawerOpen(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex items-center gap-3 py-4 px-6 cursor-pointer rounded-r-lg ${
                      isActive ? "bg-primaryColor text-white" : "text-black"
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{t(item.lable)}</span>
                  </MotionDiv>
                );
              })}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <MotionDiv
          animate={{ width: isOpen ? 270 : 80 }}
          transition={{ duration: 0.3, type: "tween" }}
          className="bg-white rounded-r-3xl shadow-md flex flex-col sticky top-0 bottom-0"
        >
          <div className="flex flex-col items-center pb-4 pt-8">
            {isOpen ? (
              <Image
                src={logo.src}
                alt="logo"
                width={180}
                height={80}
                className="mb-6 h-15 w-auto"
              />
            ) : (
              <div className="h-10" />
            )}
          </div>

          <div className="flex flex-col w-full font-medium flex-grow border-t border-gray-200 overflow-y-scroll scrollbar-hide">
            {sidebarAd.map((item, i) => {
              const isActive = activeTab === item.nav;
              return (
                <div
                  onClick={() => setActiveTab(item.nav)}
                  key={i}
                  className="relative"
                >
                  <MotionDiv
                    whileHover={{
                      x: isOpen ? 8 : 0,
                      scale: 1.05,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="py-4 cursor-pointer pl-5 pr-8 flex gap-2 items-center border-b border-gray-200 relative"
                  >
                    <AnimatePresence>
                      {isActive && (
                        <MotionDiv
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
                      <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className={isActive ? "text-white" : "text-black"}
                      >
                        {t(item.lable)}
                      </MotionDiv>
                    )}
                  </MotionDiv>
                </div>
              );
            })}
          </div>

          {/* Toggle Button */}
          <MotionDiv
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.15, backgroundColor: "#f3f3f3" }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-fit h-fit absolute top-20 right-[-15px] cursor-pointer bg-white shadow-md p-2 rounded-full"
          >
            <MotionDiv animate={{ rotate: isOpen ? 0 : 180 }}>
              <MdArrowForwardIos className="w-5 h-5" />
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
      )}
    </>
  );
};

export default AdminSideBarTab;
