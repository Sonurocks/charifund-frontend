"use client";
import { Icon } from "@iconify/react";
import { PageBannerProps } from "@/src/types/web/hero";
import { horizontalWhiteShape, spradeBase } from "@/public/assets";
import { useTranslation } from "react-i18next";
import PulsingImage from "../components/UI/web/PulsingImage";
import Image from "next/image";

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

const PageBanner: React.FC<PageBannerProps> = ({
  bgImage,
  smallIcon = "mdi:hand-heart-outline",
  tagline = "Start Donating Poor People",
  title,
}) => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[50vh] md:h-[80vh] md:w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src={bgImage}
        alt="Hero Background"
        fill
        className="object-cover object-center"
        priority
      />
      <section className="absolute top-0 left-0 h-10 w-full z-3">
        <Image
          src={horizontalWhiteShape.src}
          alt="Horizontal White Shape"
          fill
          className="object-cover object-end"
        />
      </section>

      <div className="absolute inset-0 z-2" style={pageBannerBackgourndColor} />

      <div className="absolute inset-0 pointer-events-none">
        <PulsingImage
        src={spradeBase}
        alt="heart deco"
        duration={4}
        className="absolute left-5 top-2/3 -translate-y-1/2 z-12 pointer-events-auto h-15 w-15 sm:h-20 sm:w-20 lg:h-32 lg:w-32  sm:left-10 lg:left-20  "
      />
      </div>

      {/* Content */}
      <div className="relative z-3 text-center w-full px-4 sm:px-6">
        <div className="font-caveat text-lg sm:text-xl md:text-2xl flex items-center justify-center gap-2 text-yellow mb-3 sm:mb-4">
          <Icon
            icon={smallIcon}
            width={16}
            height={16}
            className="sm:w-5 sm:h-5"
          />
          <span className="font-semibold">{t(tagline)}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-3xl md:text-4xl xl:text-[80px] font-extrabold text-white font-nunito">
          {t(title)}
        </h1>
      </div>
    </section>
  );
};

export default PageBanner;
