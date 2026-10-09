"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { PageBannerProps } from "@/src/types/web/hero";
import { horizontalWhiteShape, spradeBase } from "@/public/assets";
import { useTranslation } from "react-i18next";
import PulsingImage from "../components/UI/web/PulsingImage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../components/UI/web/Buttons/Button";
import { motion, AnimatePresence } from "framer-motion";
import ArrowButton from "@/src/components/UI/web/Buttons/ArrowButton";
import AnimatedReveal from "@/src/animations/AnimatedReveal";

import { Banner } from "@/src/types/web/banner";
import { useFetchAllBanners } from "@/src/hooks/web/useBanner";

export interface ExtendedPageBannerProps extends PageBannerProps {
  pageName?: string;
}

export const pageBannerBackgourndColor = {
  background: `
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-foreground) 100%, var(--color-dark-green)),
      color-mix(in srgb, var(--color-dark-green) 90%, transparent),
      color-mix(in srgb, var(--color-foreground) 50%, transparent),
      color-mix(in srgb, var(--color-foreground) 0%, transparent)
    )
  `,
};

const PageBanner: React.FC<ExtendedPageBannerProps> = ({
  bgImage,
  smallIcon = "mdi:hand-heart-outline",
  tagline = "Start Donating Poor People",
  title,
  titleClassName = "",
  description,
  buttonText,
  buttonRoute,
  pageName,
}) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Try to fetch dynamic banner if pageName is provided
  // We fetch up to 10 to support carousels
  const { data: bannerData, isLoading } = useFetchAllBanners(1, 10, pageName);
  
  const banners: Banner[] = pageName && bannerData?.banners && bannerData.banners.length > 0
    ? bannerData.banners
    : [];

  useEffect(() => {
    if (paused || banners.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, banners.length]);

  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const handleNext = () =>
    setIndex((prev) => (prev + 1) % banners.length);

  // Derive localized dynamic fields
  const currentLang = i18n.language as "en" | "hi";
  
  const getLocalized = (field: any, fallback: string | undefined) => {
    if (!field) return fallback;
    if (typeof field === "string") return field;
    if (typeof field === "object") return field[currentLang] || field.en || fallback;
    return fallback;
  };

  const currentBanner = banners[index] || null;

  let finalBgImage = currentBanner?.image || bgImage;
  let finalTitle = currentBanner ? getLocalized(currentBanner.title, title) : title;
  let finalSubtitle = currentBanner ? getLocalized(currentBanner.subtitle, tagline) : tagline;
  let finalDescription = currentBanner ? getLocalized((currentBanner as any).description, description) : description;

  // Bypass backend 35 character length limit restrictions securely by enforcing the exact requested client strings at render time
  if (pageName === 'Blog') {
      finalTitle = t("Our Stories & Updates");
      finalSubtitle = t("Creating Awareness • Inspiring Change");
  } else if (pageName === 'Contact Us') {
      finalTitle = t("Contact Us");
      finalSubtitle = t("Be a Part of Positive Change");
  } else if (pageName === 'About Us') {
      finalTitle = t("About YUWA INDIA");
      finalSubtitle = t("Empowering Lives, Building a Better Society");
  } else if (pageName === 'Campaign') {
      finalTitle = t("Our Campaigns for Social Change");
      finalSubtitle = t("Together for a Better Society");
  }

  // Simple skeleton loader for loading transitions to avoid jumpy UI
  if (pageName && isLoading && banners.length === 0) {
      return (
          <section className="relative w-full h-[50vh] md:h-[80vh] flex items-center justify-center bg-gray-200 animate-pulse overflow-hidden">
             <div className="absolute inset-0 z-2" style={pageBannerBackgourndColor} />
          </section>
      );
  }

  return (
    <section 
       className="relative w-full h-[50vh] md:h-[80vh] md:w-full overflow-hidden"
       onMouseEnter={() => setPaused(true)}
       onMouseLeave={() => setPaused(false)}
    >
      {/* Background image Carousel */}
      <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
              <Image
                src={finalBgImage}
                alt="Banner Background"
                fill
                className="object-cover object-center"
                priority
              />
          </motion.div>
      </AnimatePresence>

      <section className="absolute top-0 left-0 h-10 w-full z-3">
        <Image
          src={horizontalWhiteShape.src}
          alt="Horizontal White Shape"
          fill
          className="object-cover object-end"
        />
      </section>

      {/* Background Gradient */}
      <div className="absolute inset-0 z-2" style={pageBannerBackgourndColor} />

      {/* Floating Pulse Layer */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <PulsingImage
          src={spradeBase}
          alt="heart deco"
          duration={4}
          className="absolute left-5 top-2/3 -translate-y-1/2 z-12 pointer-events-auto h-15 w-15 sm:h-20 sm:w-20 lg:h-32 lg:w-32 sm:left-10 lg:left-20"
        />
      </div>

      {/* Unified Text Overlay and Controls Layer */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          {/* Content */}
          <div className="relative z-3 text-center w-full px-4 sm:px-6 md:px-8 xl:px-30">
            <AnimatedReveal
              key={index}
              direction="up"
              distance={40}
              duration={0.8}
              className="w-full"
            >
                <div className="font-caveat text-lg sm:text-xl md:text-2xl flex items-center justify-center gap-2 text-yellow mb-3 sm:mb-4">
                  <Icon
                    icon={smallIcon}
                    width={16}
                    height={16}
                    className="sm:w-5 sm:h-5"
                  />
                  <span className="font-semibold">{t(finalSubtitle || tagline)}</span>
                </div>

                {/* Title */}
                <h1 className={`text-3xl sm:text-3xl md:text-4xl xl:text-[80px] font-extrabold text-white font-nunito ${titleClassName}`}>
                  {t(finalTitle || title)}
                </h1>

                {/* Description */}
                {finalDescription && (
                  <p className="mt-4 text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-nunito">
                    {t(finalDescription)}
                  </p>
                )}

                {/* Action Button */}
                {buttonText && buttonRoute && (
                  <div className="mt-8 flex justify-center w-full">
                     <div className="w-fit">
                        <Button 
                           text={t(buttonText)} 
                           onClick={() => router.push(buttonRoute)}
                           icon="mdi:arrow-right"
                           paddingx="px-8"
                           paddingy="py-3"
                        />
                     </div>
                  </div>
                )}
            </AnimatedReveal>
          </div>

          {/* Carousel Arrows */}
          {banners.length > 1 && (
            <div className="absolute right-4 md:right-22 top-1/2 -translate-y-1/2 hidden min-[800px]:flex flex-col gap-4 z-30">
              <ArrowButton
                direction="left"
                onClick={handlePrev}
                size={60}
                className="shadow-md hover:scale-105"
              />
              <ArrowButton
                direction="right"
                onClick={handleNext}
                size={60}
                className="shadow-md hover:scale-105"
              />

              {/* Floating Decorative Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-[29%] xl:top-[82%] right-38 xl:right-40 transform -translate-y-1/2 text-yellow size-20 pointer-events-none"
              >
                <Image src={spradeBase.src} alt="decoration" width={28} height={28} />
              </motion.div>
            </div>
          )}
      </div>
    </section>
  );
};

export default PageBanner;
