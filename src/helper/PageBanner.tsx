"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { PageBannerProps } from "@/src/types/web/hero";
import { horizontalWhiteShape, spradeBase } from "@/public/assets";
import { useTranslation } from "react-i18next";
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

import PulsingImage from "../components/UI/web/PulsingImage";

const PageBanner: React.FC<ExtendedPageBannerProps> = ({
  bgImage,
  smallIcon = "mdi:hand-heart-outline",
  tagline,
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

  // Fetch dynamic banners only when pageName is provided
  const { data: bannerData, isLoading, isError } = useFetchAllBanners(1, 10, pageName);

  // Parse raw banners if pageName is defined
  // Note: API already filters by pageName server-side, so all returned banners belong to this page
  const rawBanners: Banner[] = bannerData?.banners || bannerData?.data || (Array.isArray(bannerData) ? bannerData : []);
  const pageBanners: Banner[] = pageName
    ? [...rawBanners].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
    : [];

  // Determine active slides list
  // 1. Dynamic banners from API if pageName is provided and banners exist
  // 2. Static banner if pageName is NOT provided (e.g., FAQ, policy pages, static detail pages)
  // 3. Neutral empty slide if pageName is provided but 0 banners found in API or API failed
  const isDynamicMode = Boolean(pageName);
  const hasDynamicBanners = isDynamicMode && pageBanners.length > 0;

  const activeSlides: Banner[] = (() => {
    if (hasDynamicBanners) {
      return pageBanners;
    }
    if (!isDynamicMode && bgImage) {
      return [
        {
          id: "static-page-slide",
          priority: 1,
          image: typeof bgImage === "string" ? bgImage : bgImage?.src || "",
          title: title || "",
          subtitle: tagline || "",
          description: description || "",
        } as Banner,
      ];
    }
    // Neutral empty/error state when no API banner exists: single neutral slide (no static image fallback)
    return [
      {
        id: "neutral-empty-slide",
        priority: 1,
        image: "",
        title: title || pageName || "",
        subtitle: tagline || "",
        description: description || "",
      } as Banner,
    ];
  })();

  // Reset index if slides array changes or index exceeds length
  useEffect(() => {
    if (activeSlides.length > 0 && index >= activeSlides.length) {
      setIndex(0);
    }
  }, [activeSlides.length, index]);

  // Auto transition for multi-banner carousels (only when more than 1 banner exists)
  useEffect(() => {
    if (paused || activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, activeSlides.length]);

  const handlePrev = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const handleNext = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  // Current active language
  const currentLang = (i18n.language || "en") as "en" | "hi";

  const currentBanner = activeSlides[index] || null;
  const currentBannerId = currentBanner?.id || `banner-idx-${index}`;
  const isCurrentImgFailed = failedImageKeys[currentBannerId];

  // In dynamic mode, banner image MUST come from valid API data; no static dummy images allowed
  const hasValidImage = Boolean(currentBanner?.image && currentBanner.image.trim() !== "" && !isCurrentImgFailed);
  const bgUrl = hasValidImage ? currentBanner!.image : "";

  // Extract localized content
  const finalTitle = currentBanner
    ? getLocalizedText(currentBanner.title, title, currentLang) || title || pageName
    : title || pageName;

  const finalSubtitle = currentBanner
    ? getLocalizedText(currentBanner.subtitle, tagline, currentLang) || tagline
    : tagline;

  const finalDescription = currentBanner
    ? getLocalizedText((currentBanner as any).description, description, currentLang) || description
    : description;

  // Navigation controls only render when multiple valid banners exist
  const showNavControls = activeSlides.length > 1;

  return (
    <section
      className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden bg-foreground/95"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image Layer (only if a valid banner image exists) */}
      <AnimatePresence mode="sync">
        {bgUrl ? (
          <motion.div
            key={`banner-${index}-${currentBanner?.id || index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-1 overflow-hidden"
          >
            <Image
              src={getOptimizedImageUrl(bgUrl, { width: 1920, quality: "auto", format: "auto" })}
              alt={t(finalTitle || "Page Banner")}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              onError={() => {
                if (currentBannerId) {
                  setFailedImageKeys((prev) => ({ ...prev, [currentBannerId]: true }));
                }
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Top Wave Curve */}
      <section className="absolute top-0 left-0 h-10 w-full z-3 pointer-events-none">
        <Image
          src={horizontalWhiteShape.src}
          alt="Horizontal White Shape"
          fill
          priority
          loading="eager"
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
      {showNavControls && (
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
        <div className="relative z-3 text-center w-full px-14 sm:px-16 md:px-8 xl:px-30">
          {Boolean(finalTitle || finalSubtitle || !isDynamicMode) && (
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

              {/* Action Button - only rendered together with content */}
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
          )}
        </div>

        {/* Desktop Carousel Arrows (>= 800px) */}
        {showNavControls && (
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
