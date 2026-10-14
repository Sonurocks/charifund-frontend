"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import PageBanner from "@/src/helper/PageBanner";
import ComponentLabel from "@/src/components/UI/web/ComponentLabel";
import ComponentTitle from "@/src/components/UI/web/ComponentTitle";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { footballhandbg, heartHandbg, spradeBase } from "@/public/assets";
import { servicesData } from "@/src/static-resource/services";
import ServiceCard from "./ServiceCard";

const Services: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white font-nunito overflow-hidden">
      {/* --------------------------------------------------
          SECTION 1 — HERO / BANNER
      -------------------------------------------------- */}
      <PageBanner
        pageName="Services"
        title="Our Services"
        tagline="Making a Difference, Together"
        description="Creating meaningful change through education, empowerment, healthcare, community support and sustainable development."
        smallIcon="mdi:hand-heart-outline"
      />

      {/* --------------------------------------------------
          SECTION 2 — INTRODUCTION
      -------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 xl:px-28 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Group */}
            <div className="lg:col-span-5 relative">
              <AnimatedReveal direction="left" distance={40}>
                <div className="relative mx-auto max-w-[460px] h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border-8 border-white shadow-2xl shadow-dark-green/10">
                  <Image
                    src="/assets/helpingecahother3.webp"
                    alt={t("YUWA INDIA Community Work")}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-green/60 via-transparent to-transparent" />
                  
                  {/* Badge Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-yellow/30 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow/20 flex items-center justify-center shrink-0">
                        <Icon icon="lucide:heart-handshake" className="w-6 h-6 text-dark-green" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-dark-green text-sm sm:text-base">
                          {t("Community Driven Impact")}
                        </h4>
                        <p className="text-gray-green text-xs">
                          {t("Serving children, women & families across India")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative floating heart */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-4 sm:-right-6 w-16 h-16 pointer-events-none"
                >
                  <Image src={spradeBase.src} alt="Deco" width={64} height={64} className="object-contain" />
                </motion.div>
              </AnimatedReveal>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7">
              <AnimatedReveal direction="up" distance={30}>
                <div className="mb-4">
                  <ComponentLabel text={t("Our Work")} isVisible={true} />
                </div>
                <ComponentTitle
                  preText={t("Creating Change Through Meaningful Action")}
                  highlightText=""
                  postText=""
                />
                <p className="mt-6 text-gray-green text-base sm:text-lg leading-relaxed font-nunito">
                  {t(
                    "YUWA INDIA works with communities to create opportunities, strengthen lives and build a better society. Our initiatives focus on education, empowerment, health, nutrition, livelihood, environmental protection and community development."
                  )}
                </p>

                {/* Quick Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center shrink-0">
                      <Image src={footballhandbg} alt="Mission" width={40} height={40} className="object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-green text-base mb-1">
                        {t("Inclusive Development")}
                      </h4>
                      <p className="text-gray-green text-xs sm:text-sm">
                        {t("Reaching underserved individuals with care & dignity.")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-yellow/20 flex items-center justify-center shrink-0">
                      <Image src={heartHandbg} alt="Support" width={40} height={40} className="object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-green text-base mb-1">
                        {t("Transparent Service")}
                      </h4>
                      <p className="text-gray-green text-xs sm:text-sm">
                        {t("Ensuring every resource creates tangible social value.")}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          SECTION 3 — SERVICES / AREAS OF WORK
      -------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 xl:px-28 bg-gray-50/60 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <AnimatedReveal direction="up" distance={30}>
              <ComponentLabel text={t("Areas of Work")} isVisible={true} />
              <ComponentTitle
                preText={t("Our Core Service Initiatives")}
                highlightText=""
                postText=""
              />
              <p className="mt-4 text-gray-green text-base font-nunito">
                {t(
                  "Empowering communities through targeted programs designed to deliver long-term, sustainable impact across essential social domains."
                )}
              </p>
            </AnimatedReveal>
          </div>

          {/* 8-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {servicesData.map((service, idx) => (
              <AnimatedReveal key={service.id} direction="up" distance={30} delay={0.08 * idx}>
                <ServiceCard service={service} />
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
