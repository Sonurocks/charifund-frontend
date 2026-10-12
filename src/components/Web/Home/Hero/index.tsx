
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  bannerOne,
  bannerTwo,
  horizontalWhiteShape,
  spradeBase,
  verticleYellowShape,
} from "@/public/assets";
import Button from "../../../UI/web/Buttons/Button";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import Image from "next/image";
import Link from "next/link";
import { useFetchAllBanners } from "@/src/hooks/web/useBanner";
import { pageBannerBackgourndColor } from "@/src/helper/PageBanner";
import { Banner } from "@/src/types/web/banner";
import ArrowButton from "@/src/components/UI/web/Buttons/ArrowButton";
import { useTranslation } from "react-i18next";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

const staticImages = [bannerOne.src, bannerTwo.src];

const getLocalizedText = (
  field: any,
  fallback: string,
  currentLang: "en" | "hi"
): string => {
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

const HeroStaticSlider = () => {
  const { i18n, t } = useTranslation();
  const currentLang = (i18n.language || "en") as "en" | "hi";

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const { data: bannersData } = useFetchAllBanners(1, 10, "Home");
  const banners: Banner[] = bannersData?.banners || bannersData?.data || (Array.isArray(bannersData) ? bannersData : []);

  const images =
    banners.length > 0
      ? banners
        .filter((banner: Banner) => banner.image && banner.image.trim() !== "")
        .map((banner: Banner) => banner.image)
      : staticImages;

  const finalImages = images.length > 0 ? images : staticImages;

  useEffect(() => {
    if (finalImages.length > 0 && index >= finalImages.length) {
      setIndex(0);
    }
  }, [finalImages.length, index]);

  useEffect(() => {
    if (paused || finalImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % finalImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, finalImages.length]);

  const handlePrev = useCallback(() =>
    setIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length),
    [finalImages.length]
  );
  const handleNext = useCallback(() =>
    setIndex((prev) => (prev + 1) % finalImages.length),
    [finalImages.length]
  );

  // Get current banner data
  const currentBanner = banners[index] || null;
  const rawTitle = currentBanner
    ? getLocalizedText(currentBanner.title, "Giving Help To Those Who Need It", currentLang)
    : "Giving Help To Those Who Need It";
  const rawSubtitle = currentBanner
    ? getLocalizedText(currentBanner.subtitle, "Start Donating Poor People", currentLang)
    : "Start Donating Poor People";

  const bannerTitle = t(rawTitle);
  const bannerSubtitle = t(rawSubtitle);

  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  const currentImgSrc = failedIndices[index]
    ? staticImages[index % staticImages.length]
    : finalImages[index];

  return (
    <div
      className="relative w-full h-[80vh] xl:h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 overflow-hidden"
      >
        {currentImgSrc && (
          <Image
            src={getOptimizedImageUrl(currentImgSrc, { width: 1920, quality: "auto", format: "auto" })}
            alt={bannerTitle || "Hero Banner"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            onError={() => {
              setFailedIndices((prev) => ({ ...prev, [index]: true }));
            }}
          />
        )}
      </motion.div>

      <section className="relative h-5 w-full z-22">
        <Image
          src={horizontalWhiteShape.src}
          alt="Horizontal White Shape"
          fill
          priority
        />
      </section>

      <section className="relative h-[80vh] xl:h-screen w-20 md:w-30 z-21">
        <motion.div
          animate={{ y: [0, -20, 0, 20, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full relative"
        >
          <Image
            src={verticleYellowShape.src}
            alt="Vertical Yellow Shape"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/*  Text Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 xl:px-30 z-20 font-nunito"
        style={pageBannerBackgourndColor}
      >
        <div className="ml-2 md:ml-4 lg:ml-6 xl:ml-8">
          <AnimatedReveal
            key={index}
            direction="left"
            distance={100}
            duration={1}
            className="space-y-6"
          >
            <p className="text-yellow text-xl sm:text-2xl font-medium flex items-center gap-2 font-caveat">
              <Icon
                icon="mdi:hand-heart"
                className="text-2xl sm:text-3xl font-medium cursor-pointer"
              />
              {bannerSubtitle}
            </p>

            <h1 className="text-3xl max-w-[17ch] sm:text-4xl sm:max-w-[17ch] md:text-6xl md:max-w-[12ch] lg:text-6xl xl:text-7xl font-extrabold text-white xl:max-w-[12ch] leading-tight">
              {bannerTitle}
            </h1>

            <div className="flex flex-col min-[450px]:flex-row md:flex-nowrap gap-2 sm:gap-4 mt-6 w-fit">
              <div className="w-auto sm:w-auto min-w-[50px] sm:min-w-[120px]">
                <Link href="/campaign">
                  <Button
                    text="Know more"
                    textColor="text-white"
                    bgColor="bg-black/30"
                    hoverBg="before:bg-yellow"
                    hoverTextColor="group-hover:text-foreground"
                    paddingy="py-5"
                  />
                </Link>
              </div>
              <div className="sm:w-auto min-w-[50px] sm:min-w-[120px]">
                <Link href="/contact">
                  <Button text="Join us" paddingy="py-5" />
                </Link>
              </div>
            </div>
          </AnimatedReveal>
        </div>

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
            className="absolute top-[29%] xl:top-[82%] right-38 xl:right-40 transform -translate-y-1/2 text-yellow size-20"
          >
            <Image src={spradeBase.src} alt="decoration" width={28} height={28} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


export default HeroStaticSlider