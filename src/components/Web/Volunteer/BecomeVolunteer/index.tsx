"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import becomeVolunteerBg from "@/public/assets/becomevoluntter2.webp";
import volunteerIcon from "@/public/assets/icon.webp";
import yellowImage from "@/public/assets/yellow_image.webp";
import videoBg from "@/public/assets/sendmessagefordonation.webp";
import thumbLg from "@/public/assets/becomevolunteer3.webp";
import Button from "@/src/components/UI/web/Buttons/Button";

const BecomeVolunteer: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const leftPanelInView = useInView(leftPanelRef, { once: true });
  const rightPanelInView = useInView(rightPanelRef, { once: true });
  const router = useRouter();
  const{t}=useTranslation();
  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);
  const handleDonateNow = () => router.push("/donate-us");
  const handleContactNow = () => router.push("/volunteer");

  return (
    <section className="relative w-full lg:h-[500px] md:h-auto h-auto overflow-hidden lg:px-0 md:px-4  ">
      {/* Three Panel Layout */}
      <div className="flex h-full lg:flex-row flex-col gap-4 lg:gap-0 relative">
        {/* Left Panel */}
        <div className="flex-1 relative lg:h-full md:h-[400px] h-[300px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${becomeVolunteerBg.src})`,
            }}
          >
            <div className="absolute inset-0 bg-black/85"></div>
          </div>

          <div
            ref={leftPanelRef}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center py-6 px-4 md:px-6 lg:px-8"
          >
            <motion.div
              className="mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={leftPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Image
                src={volunteerIcon}
                alt="Hand Heart Icon"
                width={60}
                height={60}
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </motion.div>

            <motion.p
              className="text-white text-xs md:text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={leftPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              {t("We Give Child A Gift Of A Education")}
            </motion.p>
            <motion.h3
              className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8"
              style={{
                fontFamily: "var(--font-nunito), Nunito, sans-serif",
                fontWeight: "700",
              }}
              initial={{ opacity: 0 }}
              animate={leftPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            >
              {t("Become A Volunteer")}?
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              animate={leftPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            >
              <Button
                text="Contact Now"
                icon=""
                bgColor="bg-green"
                hoverBg="before:bg-yellow"
                textColor="text-white"
                hoverTextColor="group-hover:text-black"
                paddingx="px-6 md:px-8 lg:px-9"
                paddingy="py-3 md:py-4"
                onClick={handleContactNow}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center relative lg:h-full md:h-[400px] h-[300px] min-h-[200px]">
          {/* Desktop version with mask */}
          <div className="hidden lg:block">
            <div
              className="bg-center bg-no-repeat w-full h-full absolute lg:!w-[120%] lg:translate-x-[-10%] inset-0 z-10"
              style={{ 
                backgroundImage: `url(${yellowImage.src})`,
                backgroundSize: "100% 100%" 
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  inset: "0px 5px 0px 5px",
                  WebkitMaskImage: `url(${yellowImage.src})`,
                  maskImage: `url(${yellowImage.src})`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "99% 100%",
                  maskSize: "99% 100%",
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${videoBg.src})`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Mobile/Tablet version without mask */}
          <div className="lg:hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${videoBg.src})`,
              }}
            >
              <div className="absolute inset-0 bg-black/55"></div>
            </div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center md:bg-center absolute inset-0">
            <div className="relative flex items-center justify-center w-full h-full">
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 bg-yellow rounded-full flex items-center justify-center relative cursor-pointer"
                style={{
                  border: "2px dashed #000000",
                }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0, 0, 0, 0.7)",
                    "0 0 0 20px rgba(0, 0, 0, 0)",
                    "0 0 0 0 rgba(0, 0, 0, 0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  delay: 2,
                  repeat: Infinity,
                }}
                onClick={openVideoModal}
              >
                <div className="w-0 h-0 border-l-[12px] md:border-l-[16px] border-l-black border-t-[8px] md:border-t-[12px] border-t-transparent border-b-[8px] md:border-b-[12px] border-b-transparent ml-1"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 relative lg:h-full md:h-[400px] h-[300px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${thumbLg.src})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green  to-transparent"></div>
          </div>

          <div
            ref={rightPanelRef}
            className="relative z-10 h-full flex flex-col items-center justify-center text-center py-6 px-4 md:px-6 lg:px-8"
          >
            <motion.div
              className="mb-3 md:mb-4"
              initial={{ opacity: 0 }}
              animate={rightPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Image
                src={volunteerIcon}
                alt="Hand Heart Icon"
                width={60}
                height={60}
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </motion.div>

            <motion.p
              className="text-white text-xs md:text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={rightPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              {t("We Give Child A Gift Of A Education")}
            </motion.p>
            <motion.h3
              className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8"
              style={{
                fontFamily: "var(--font-nunito), Nunito, sans-serif",
                fontWeight: "700",
              }}
              initial={{ opacity: 0 }}
              animate={rightPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            >
              {t("Make Donation To Us?")}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              animate={rightPanelInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            >
              <Button
                text="Donate Now"
                icon=""
                bgColor="bg-yellow"
                hoverBg="before:bg-green"
                textColor="text-black"
                hoverTextColor="group-hover:text-white"
                paddingx="px-6 md:px-8 lg:px-9"
                paddingy="py-3 md:py-4"
                onClick={handleDonateNow}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={closeVideoModal}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300 transition-colors"
            >
              ×
            </button>

            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/XxVg_s8xAms?autoplay=1"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BecomeVolunteer;
