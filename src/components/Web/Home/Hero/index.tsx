
"use client";

import { useEffect, useState } from "react";
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
import ArrowButton from "@/src/components/Button";

// Static fallback images
const staticImages = [bannerOne.src, bannerTwo.src];

export default function HeroStaticSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fetch dynamic banner data
  const { data: bannersData, isLoading, error } = useFetchAllBanners(1, 10);
  const banners = bannersData?.banners || [];

  const images =
    banners.length > 0
      ? banners
          .filter((banner: Banner) => banner.image && banner.image.trim() !== "")
          .map((banner: Banner) => banner.image)
      : staticImages;

  // If no valid dynamic images, use static fallback
  const finalImages = images.length > 0 ? images : staticImages;

  // Auto image change
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % finalImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, finalImages.length]);

  const handlePrev = () =>
    setIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
  const handleNext = () =>
    setIndex((prev) => (prev + 1) % finalImages.length);

  // Get current banner data
  const currentBanner = banners[index] || {};
  const bannerTitle =
    currentBanner.title || "Giving Help To Those Who Need It";
  const bannerSubtitle =
    currentBanner.subtitle || "Start Donating Poor People";
  const bannerLink = currentBanner.link || "/contact";

  return (
    <div
      className="relative w-full h-[80vh] xl:h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*  Background Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${finalImages[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "922.4px",
        }}
      />

      <section className="relative h-5 w-full z-22">
        <Image
          src={horizontalWhiteShape.src}
          alt="Horizontal White Shape"
          fill
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
          />
        </motion.div>
      </section>

      {/*  Text Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-6 md:px-16 lg:px-30 z-20 font-nunito"
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
                    text="Discover More"
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
                  <Button text="Get A Quote" paddingy="py-5" />
                </Link>
              </div>
            </div>
          </AnimatedReveal>
        </div>

        {/* ✅ Navigation Arrows - Desktop (Updated) */}
        <div className="absolute right-4 md:right-22 top-1/2 -translate-y-1/2 hidden min-[800px]:flex flex-col gap-4 z-30">
         {/* <button
            onClick={handlePrev}
            size={60}
            className="shadow-md hover:scale-105"
          />
          <ArrowButton
            direction="right"
            onClick={handleNext}
            className="w-15 h-15 rounded-full bg-yellow cursor-pointer flex items-center justify-center text-black shadow-md hover:text-white hover:scale-105 hover:bg-dark-green transition"
          >
            <Icon icon="mdi:arrow-right" className="text-3xl" />
          </button>*/}

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
            <Image src={spradeBase.src} alt="decoration" width={28} height={28}/>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
