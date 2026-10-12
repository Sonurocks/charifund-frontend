"use client";
import { useState, useEffect, useCallback } from "react";
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
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

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

// Helper function to safely extract localized text from string, JSON string, or object
const getLocalizedText = (
  field: any,
  fallback: string | undefined,
  currentLang: "en" | "hi"
): string | undefined => {
  if (!field) return fallback;
  let parsed = field;
  if (typeof field === "string") {
    const trimmed = field.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch (e) {
        return field;
      }
    } else {
      return field;
    }
  }
  if (typeof parsed === "object" && parsed !== null) {
    return parsed[currentLang] || parsed.en || parsed.hi || (typeof field === "string" ? field : fallback);
  }
  return typeof parsed === "string" ? parsed : fallback;
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
  const [failedImageKeys, setFailedImageKeys] = useState<Record<string, boolean>>({});
  const [staticImgFailed, setStaticImgFailed] = useState(false);

  // Fetch dynamic banners if pageName is provided (up to 10 for carousels)
  const { data: bannerData } = useFetchAllBanners(1, 10, pageName);

  const rawBanners = bannerData?.banners || bannerData?.data || (Array.isArray(bannerData) ? bannerData : []);
  const fetchedBanners: Banner[] = pageName && Array.isArray(rawBanners) && rawBanners.length > 0
    ? rawBanners
    : [];

  // Build active slides list - clean & no fallback image flash on refresh, guarantees arrows are always shown
  const activeSlides = (() => {
    if (fetchedBanners.length > 1) {
      return fetchedBanners;
    }
    if (fetchedBanners.length === 1) {
      return [
        fetchedBanners[0],
        {
          id: "static-slide-fallback-2",
          priority: 2,
          image: bgImage || "/assets/aboutus.webp",
          title: title || "Empowering Communities Together",
          subtitle: tagline || "Join Our Cause",
          description: description || "Creating a lasting positive impact for those in need.",
        } as unknown as Banner,
      ];
    }
    return [
      {
        id: "static-slide-1",
        priority: 1,
        image: bgImage || "/assets/aboutus.webp",
        title: title || "Giving Help To Those Who Need It",
        subtitle: tagline || "Start Donating Poor People",
        description: description || "Support communities and transform lives with YUWA India.",
      } as unknown as Banner,
      {
        id: "static-slide-2",
        priority: 2,
        image: "/assets/aboutus.webp",
        title: title || "Empowering Communities Together",
        subtitle: tagline || "Join Our Cause",
        description: description || "Creating a lasting positive impact for those in need.",
      } as unknown as Banner,
    ];
  })();

  // Reset index if slides array changes or index exceeds length
  useEffect(() => {
    if (activeSlides.length > 0 && index >= activeSlides.length) {
      setIndex(0);
    }
  }, [activeSlides.length, index]);

  // Auto transition for multi-banner carousels
  useEffect(() => {
    if (paused || activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, activeSlides.length]);

  const handlePrev = useCallback(() => {
    if (activeSlides.length === 0) return;
    setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const handleNext = useCallback(() => {
    if (activeSlides.length === 0) return;
    setIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  // Current active language
  const currentLang = (i18n.language || "en") as "en" | "hi";

  const currentBanner = activeSlides[index] || null;
  const currentBannerId = currentBanner?.id || `banner-idx-${index}`;
  const isCurrentImgFailed = failedImageKeys[currentBannerId];

  const hasBackendBanner = currentBanner !== null && Boolean(currentBanner.image) && !isCurrentImgFailed;

  // Determine active fields (Backend / active slide first if present and not failed, static fallback if not)
  const finalBgImage = hasBackendBanner ? currentBanner.image : (staticImgFailed ? "/assets/aboutus.webp" : bgImage);

  const rawTitle = currentBanner
    ? getLocalizedText(currentBanner.title, title, currentLang)
    : title;

  const rawSubtitle = currentBanner
    ? getLocalizedText(currentBanner.subtitle, tagline, currentLang)
    : tagline;

  const rawDescription = currentBanner
    ? getLocalizedText((currentBanner as any).description, description, currentLang)
    : description;

  const finalTitle = rawTitle || title;
  const finalSubtitle = rawSubtitle || tagline;
  const finalDescription = rawDescription || description;

  // Helper to extract image URL string
  const getImgSrc = (img: any): string => {
    if (!img) return "/assets/aboutus.webp";
    if (typeof img === "string") return img;
    if (typeof img === "object") return img.src || img.default?.src || "/assets/aboutus.webp";
    return "/assets/aboutus.webp";
  };

  const bgUrl = getImgSrc(finalBgImage);

  return (
    <section
      className="relative w-full h-[50vh] md:h-[80vh] md:w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image Carousel */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`banner-${index}-${currentBanner?.id || index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-1 overflow-hidden"
        >
          {bgUrl && (
            <Image
              src={getOptimizedImageUrl(bgUrl, { width: 1920, quality: "auto", format: "auto" })}
              alt={t(finalTitle || "Page Banner")}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              onError={() => {
                if (hasBackendBanner && currentBannerId) {
                  setFailedImageKeys((prev) => ({ ...prev, [currentBannerId]: true }));
                } else if (!staticImgFailed) {
                  setStaticImgFailed(true);
                }
              }}
            />
          )}
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

      {/* Mobile Floating Overlay Left/Right Arrows (< 800px) */}
      {activeSlides.length > 1 && (
        <>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 min-[800px]:hidden">
            <ArrowButton
              direction="left"
              onClick={handlePrev}
              size={44}
              className="shadow-lg hover:scale-105"
            />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 min-[800px]:hidden">
            <ArrowButton
              direction="right"
              onClick={handleNext}
              size={44}
              className="shadow-lg hover:scale-105"
            />
          </div>
        </>
      )}

      {/* Text Overlay and Controls */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
        {/* Content */}
        <div className="relative z-3 text-center w-full px-4 sm:px-6 md:px-8 xl:px-30">
          <AnimatedReveal
            key={`text-${index}-${currentBanner?.id || index}`}
            direction="up"
            distance={40}
            duration={0.8}
            className="w-full"
          >
            {finalSubtitle && (
              <div className="font-caveat text-lg sm:text-xl md:text-2xl flex items-center justify-center gap-2 text-yellow mb-3 sm:mb-4">
                <Icon
                  icon={smallIcon}
                  width={16}
                  height={16}
                  className="sm:w-5 sm:h-5"
                />
                <span className="font-semibold">{t(finalSubtitle)}</span>
              </div>
            )}

            {/* Title */}
            {finalTitle && (
              <h1 className={`text-3xl sm:text-3xl md:text-4xl xl:text-[80px] font-extrabold text-white font-nunito ${titleClassName}`}>
                {t(finalTitle)}
              </h1>
            )}

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

        {/* Desktop Carousel Arrows (>= 800px) */}
        {activeSlides.length > 1 && (
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

