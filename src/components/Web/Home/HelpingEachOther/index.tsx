"use client";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiPhoneCall } from "react-icons/fi";
import { motion, useInView } from "framer-motion";
import Button from "../../../UI/web/Buttons/Button";

import { useTranslation } from "react-i18next";
import { footballhandbg, heartHandbg } from "@/public/assets";
import ComponentTitle from "@/src/components/UI/web/ComponentTitle";

export default function HelpingEachOther() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  const isImageInView = useInView(imageRef, { once: true, amount: 0.1 });
  const isOverlayInView = useInView(overlayRef, { once: true, amount: 0.1 });


  const handleVideoOpen = useCallback(() => {
    setIsVideoOpen(true);
  }, []);

  const handleVideoClose = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  const handleMoreAboutUs = useCallback(() => {
    router.push("/about");
  }, [router]);

  return (
    <>
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-foreground/30">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={handleVideoClose}
              className="absolute -top-12 right-0 cursor-pointer  text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close video"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full aspect-video cursor-pointer bg-foreground rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/XxVg_s8xAms?autoplay=1&rel=0&modestbranding=1"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Introduction to React.js"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <section className="help relative  py-2 lg:py-3 xl:py-20 bg-white overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 md:top-10 transform -translate-y-1/2 opacity-60 hover:opacity-50 transition-opacity duration-300"
          animate={{
            y: [-80, 80, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        >
          <Image
            src="/assets/hand (1) section2.webp"
            alt="Hand outline"
            width={100}
            height={100}
            className="w-10 md:w-20 lg:w-21 "
          />
        </motion.div>

        <div className=" w-full mx-auto xl:px-2 2xl:px-0 mt-10 lg:mt-20 max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-7 xl:pl-30  xl:gap-15">

            <div className="relative  col-span-3  opacity-0 anim-fade-in-left hidden lg:block">

              <div className="hidden xl:block lg:h-[450px] absolute -left-1 top-42 -bottom-15 w-16 lg:w-16 xl:w-23 bg-green rounded-3xl border-t-4 border-b-4 border-yellow-500  items-center justify-center z-20 transition-all duration-300">
                <div
                  className="transform -rotate-90 text-white font-extrabold text-xl whitespace-nowrap mt-80 px-2"
                  style={{
                    fontFamily: "var(--font-nunito), Nunito, sans-serif",
                    fontWeight: "800",
                  }}
                >
                  <span className="text-white">{t("Together, ")} </span>
                  <span className="text-yellow">{t("We Can Make ")}</span>
                  <span className="text-white"> {t("a Difference")}</span>
                </div>
              </div>

              {/* Grid pattern - only show on xl+ */}
              <div className="hidden xl:block absolute  -left-3 lg:-left-6 xl:-left-11 top-95 -bottom-4 z-10">
                <Image
                  src="/assets/grid.webp"
                  alt="Grid pattern"
                  width={120}
                  height={400}
                  className="grid-line"
                  style={{
                    opacity: 0.811946,
                    transform: "translateY(0.723387px)",
                  }}
                />
              </div>

              <div className="relative ml-0 md:ml-16 lg:ml-0 xl:ml-16 2xl:ml-28">
                {/* Decorative wavy line - only show on xl+ */}
                <div
                  className="hidden lg:block absolute lg:-top-7 xl:-top-10 lg:left-44 xl:left-59 z-30 opacity-0 anim-fade-in-left"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Image
                    src="/assets/line.webp"
                    alt="Decorative wavy line"
                    width={200}
                    height={40}
                    className="animate-[float_4s_ease-in-out_infinite] hover:scale-110 transition-transform duration-300"
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                </div>


                <div className="relative hidden lg:block  ">

                  <motion.div
                    ref={imageRef}
                    className="relative  max-w-[500px] h-[500px] xl:h-[550px] rounded-2xl overflow-hidden border-8 border-white shadow-xl shadow-foreground/20 "
                    initial={{ opacity: 0, x: 100 }}
                    animate={
                      isImageInView ? { opacity: 1, x: 0 } : {}
                    }
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                      delay: 0.1
                    }}
                  >
                    <Image
                      src="/assets/helpingecahother3.webp"
                      alt="Children in need"
                      fill
                      className="object-cover "
                      priority
                    />
                    <div
                      className="absolute inset-0 
               bg-[linear-gradient(104deg,rgba(12,26,23,0)_1.9%,rgba(0,113,93,.08)_18.93%,rgba(0,113,93,.17)_29.72%,rgba(0,113,93,.37)_83.58%,rgba(0,113,93,.67)_109.85%,#00715d_133.89%,#00715d_133.91%,rgba(0,113,93,.91)_149.32%)]"
                    />
                    <button
                      aria-label="Play video"
                      className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                      onClick={handleVideoOpen}
                    >
                      <span className="relative flex items-center justify-center">
                        <motion.span
                          className="absolute w-32 h-32 rounded-full bg-foreground/30 group-hover:bg-foreground/40 transition-colors"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(0, 0, 0, 0.5)",
                              "0 0 0 20px rgba(0, 0, 0, 0.2)",
                              "0 0 0 0 rgba(0, 0, 0, 0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            delay: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        ></motion.span>
                        <span className="relative w-20 h-20 rounded-full bg-yellow shadow-lg flex items-center justify-center">
                          <div className="relative w-12 h-12 rounded-full border-1 border-dashed border-foreground flex items-center justify-center">
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="ml-1 text-foreground"
                            >
                              <path d="M8 5v14l11-7L8 5z" />
                            </svg>
                          </div>
                        </span>
                      </span>
                    </button>
                  </motion.div>

                  {/* Top left overlay image */}
                  <div className="absolute -top-14 -left-22 xl:-top-15 xl:-left-24 lg:w-60 lg:h-55 xl:w-60 xl:h-60 rounded-2xl overflow-hidden shadow-lg border-6 border-white bg-white">
                    <Image
                      src="/assets/helpingeachother1.webp"
                      alt="Community meal"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Bottom right overlay image */}
                  <div className="absolute lg:-bottom-28 xl:-bottom-20 right-0 xl:right-0 w-60 h-60 rounded-2xl overflow-hidden shadow-lg border-6 border-white bg-white">
                    <Image
                      src="/assets/helpingeachother2.webp"
                      alt="Smiling child"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <motion.div
                  ref={overlayRef}
                  className="hidden lg:block absolute -bottom-28 xl:-bottom-20 md:right-40 xl:left-20 w-50 h-60  bg-white border-1 border-yellow rounded-lg overflow-hidden -z-10"
                  initial={{ opacity: 0, x: 100 }}
                  animate={
                    isOverlayInView ? { opacity: 1, x: 0 } : {}
                  }
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                    delay: 0.4
                  }}
                ></motion.div>
              </div>


              {/* Animated parachute */}
              <motion.div
                className="absolute hidden lg:block top-0 -left-40 w-10 h-10 lg:h-40 lg:w-40 xl:w-50 xl:h-50 bottom-20 hover:scale-110 transition-transform duration-300"
                animate={{
                  top: [-300, 1200],
                  x: [0, -53.371, 0],
                  rotate: [0, -23.4842, 0],
                }}
                transition={{
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  insetInlineStart: "2%",
                  zIndex: -1,
                }}
              >
                <Image
                  src="/assets/parasuit.webp"
                  alt="Hot air balloon"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Right Side - Content Section */}
            <div
              className="relative opacity-0 anim-fade-in-right pl-3  md:pl-20 md:pt-15 lg:pt-0 md:pr-15 lg:w-full md:px-0 lg:pl-7 lg:pr-20 xl:pr-10  col-span-4"
              style={{ animationDelay: "0.2s" }}
            >
              <motion.div
                className="absolute lg:hidden top-0 left-0 w-10 h-10 md:w-16 md:h-16 transition-transform duration-300"
                animate={{
                  top: [-60, 1200],
                  x: [0, -50, 0],
                  rotate: [0, -23.4842, 0],
                }}
                transition={{
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  insetInlineStart: "2%",
                  zIndex: 0,
                }}
              >
                <Image
                  src="/assets/parasuit.webp"
                  alt="Hot air balloon"
                  width={100}
                  height={100}
                />
              </motion.div>
              <div
                className="flex items-center mb-5  opacity-0 anim-fade-in-up"
                style={{ animationDelay: "0.6s" }}
              >
                <i className="text-lg md:text-xl mr-2 text-green hand-icon"></i>
                <span className="text-green font-caveat text-lg md:text-2xl lg:text-2xl font-bold">
                  {t("Together for a Better Society")}
                </span>
              </div>
              <ComponentTitle
                preText={t("Empowering Lives, Building a Better Society")}
                highlightText=""
                postText=""
              />

              <p
                className="text-gray-green   xs:pl-1 pr-2 md:pr-15 lg:pr-2 md:pl-0 xs:pr-5 text-[14px] md:text-[14px] md:tracking-wide md:font-normal tracking-wide xs:-tracking-normal xs:leading-7 lg:font-normal leading-7  lg:text-[14px] xl:text-[16px] xl:tracking-wide lg:leading-7 lg:tracking-normal font-nunito xl:pr-5  opacity-0 anim-fade-in-up"
                style={{ animationDelay: "1s" }}
              >
                {t(
                  "YUWA India is committed to creating positive social change through education, child welfare, women empowerment, skill development, healthcare, blood donation and environmental protection. We work together to empower individuals and build a stronger, healthier and more inclusive society."
                )}
              </p>

              <div className="grid grid-cols-1 mt-5  md:mt-8 lg:mt-2 xl:mt-7  md:grid-cols-2 gap-6 md:gap-8 lg:p-2 lg:gap-6 mb-8">
                <div
                  className="flex items-center gap-4 opacity-0 anim-fade-in-up"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="w-13 h-13 xs:w-14 xs:h-14 lg:w-15 lg:h-15   rounded-lg flex items-center justify-center  flex-shrink-0">
                    <Image
                      src={footballhandbg}
                      alt="Football hands icon"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-[16px] md:text-lg lg:whitespace-nowrap lg:text-[16px] xl:text-xl mb-1 font-bold text-dark-green font-nunito"
                      style={{
                        fontFamily: "var(--font-nunito), Nunito, sans-serif",
                        fontWeight: "800",
                      }}
                    >
                      {t("Join Our Mission")}
                    </h3>
                    <p className="text-gray-green pr-5 xs:pr-5 font-nunito text-sm lg:text-sm  xl:leading-6">
                      {t(
                        "Become a volunteer and contribute your time, skills and ideas to meaningful community service initiatives."
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center  gap-4 opacity-0 anim-fade-in-up"
                  style={{ animationDelay: "1.4s" }}
                >
                  <div className="w-13 h-13 xs:w-14 xs:h-14 lg:w-15 lg:h-15   rounded-lg bg-white flex items-center justify-center  flex-shrink-0">
                    <Image
                      src={heartHandbg}
                      alt="hearthand"
                      width={120}
                      height={100}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-[16px] md:text-lg lg:text-[16px] xl:text-xl mb-1 font-bold text-dark-green font-nunito"
                      style={{
                        fontFamily: "var(--font-nunito), Nunito, sans-serif",
                        fontWeight: "800",
                      }}
                    >
                      {t("Support Our Cause")}
                    </h3>
                    <p className="text-gray-green pr-5 xs:pr-5 font-nunito text-sm lg:text-sm xl:leading-6">
                      {t(
                        "Your support helps us reach more children, women and families through our social welfare and development initiatives."
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="space-y-4 md:space-y-5 mb-5 md:mb-8 lg:mb-6 opacity-0 anim-fade-in-up"
                style={{ animationDelay: "1.6s" }}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <FaCheckCircle className="text-dark-green md:w-5 md:h-5 mt-1 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-dark-green font-bold text-sm md:text-sm xl:text-[16px] leading-tight">
                      {t("Child Education & Welfare")}
                    </span>
                    <span className="text-gray-green leading-snug tracking-wide text-xs sm:text-sm mt-1">
                      {t("Supporting education, care and opportunities for underprivileged children.")}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <FaCheckCircle className="text-dark-green md:w-5 md:h-5 mt-1 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-dark-green font-bold text-sm md:text-sm xl:text-[16px] leading-tight">
                      {t("Women & Youth Empowerment")}
                    </span>
                    <span className="text-gray-green leading-snug tracking-wide text-xs sm:text-sm mt-1">
                      {t("Promoting skill development, self-reliance and leadership among women and youth.")}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <FaCheckCircle className="text-dark-green md:w-5 md:h-5 mt-1 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-dark-green font-bold text-sm md:text-sm xl:text-[16px] leading-tight">
                      {t("Healthcare, Blood Donation & Environment")}
                    </span>
                    <span className="text-gray-green leading-snug tracking-wide text-xs sm:text-sm mt-1">
                      {t("Organising blood donation drives, health awareness activities and environmental initiatives.")}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col [@media(min-width:400px)]:flex-row mt-4 xs:mt-8 mb-20 lg:mb-25 xl:mb-15 lg:mt-10 items-start [@media(min-width:400px)]:items-center gap-8 [@media(min-width:400px)]:gap-3 lg:gap-5 opacity-0 anim-fade-in-up"
                style={{ animationDelay: "1.8s" }}
              >
                <div className="flex items-center justify-center">
                  <Button
                    text={t("More About Us →")}
                    bgColor="bg-yellow"
                    textColor="text-foreground text-sm  lg:text-sm xl:text-[16px] font-extrabold"
                    fontWeight=""
                    icon=""
                    hoverTextColor="group-hover:text-white"
                    hoverBg="before:bg-green"
                    paddingy="py-6 xs:py-6 md:py-6 lg:py-6 xl:py-7"
                    onClick={handleMoreAboutUs}
                  />
                </div>

                <div className="flex items-center justify-center cursor-pointer  gap-3 lg:gap-5  sm:ml-6 lg:ml-4 hover:scale-105 transition-transform duration-400">
                  <FiPhoneCall className="w-7 h-7 sm:w-7 sm:h-7 font-light text-dark-green" />
                  <div>
                    <p className="text-gray-green text-[12px] xs:text-sm font-bold lg:font-semibold sm:text-[14px] font-nunito leading-none ">
                      {t("Get Involved With Us")}
                    </p>
                    <a
                      href="tel:+918565006669"
                      className="text-[16px] font-bold xs:text-[18px] lg:text-lg lg:font-bold font-nunito text-dark-green"
                    >
                      +91 85650 06669
                    </a>
                  </div>
                </div>
              </div>

              <motion.div
                className="fixed right-8 top-2/3 transform -translate-y-1/2 pointer-events-none z-50"
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.5, 1, 0.5],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror",
                }}
              >
                <Image
                  src="/assets/spade.webp"
                  alt="Heart Outline"
                  width={60}
                  height={60}
                  className="w-10 h-10 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}
