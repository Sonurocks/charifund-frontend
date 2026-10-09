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
import Button from "@/src/components/UI/web/Buttons/Button";
import { useRouter } from "next/navigation";
import { aboutus, footballhandbg, heartHandbg, spradeBase } from "@/public/assets";
import { servicesData } from "@/src/static-resource/services";
import ServiceCard from "./ServiceCard";

const Services: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="w-full bg-white font-nunito overflow-hidden">
      {/* --------------------------------------------------
          SECTION 1 — HERO / BANNER
      -------------------------------------------------- */}
      <PageBanner
        pageName="Services"
        bgImage={aboutus}
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

      {/* --------------------------------------------------
          SECTION 4 — FINAL CTA
      -------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 xl:px-28 bg-dark-green text-white relative overflow-hidden">
        {/* Decorative Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <AnimatedReveal direction="up" distance={30}>
            <div className="font-caveat text-xl sm:text-2xl text-yellow mb-3 font-bold flex items-center justify-center gap-2">
              <Icon icon="mdi:hand-heart" className="w-6 h-6 text-yellow" />
              <span>{t("Together We Can Make a Difference")}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 font-nunito leading-tight">
              {t("Be a Part of Positive Change")}
            </h2>

            <p className="text-white/80 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-nunito mb-10">
              {t(
                "Every initiative begins with people who care. Your support, participation and contribution can help us reach more communities and create meaningful opportunities for those who need them most."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Button
                text={t("Donate Now →")}
                bgColor="bg-yellow"
                textColor="text-foreground text-base font-extrabold"
                hoverBg="before:bg-white"
                paddingx="px-8"
                paddingy="py-4"
                onClick={() => router.push("/donate-us")}
              />
              <Button
                text={t("Become a Volunteer →")}
                bgColor="bg-white/10"
                textColor="text-white text-base font-extrabold"
                hoverBg="before:bg-yellow"
                hoverTextColor="group-hover:text-foreground"
                paddingx="px-8"
                paddingy="py-4"
                onClick={() => router.push("/volunteer")}
              />
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </div>
  );
};

export default Services;
