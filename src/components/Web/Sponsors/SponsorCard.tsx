"use client";

import Image from "next/image";
import Link from "next/link";
import { Sponsor } from "@/src/types/web/sponsor";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

interface SponsorCardProps {
  sponsor: Sponsor;
}

const getLocalizedValue = (val: any, lang: string): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.en || "";
};

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const [imgSrc, setImgSrc] = useState(sponsor.logo || "/assets/aboutus.webp");

  const name = getLocalizedValue(sponsor.name, currentLang);
  const categoryRaw = getLocalizedValue(sponsor.category, currentLang);
  const category = t(categoryRaw) || categoryRaw;
  const shortDescription = getLocalizedValue(sponsor.shortDescription, currentLang);
  const location = getLocalizedValue(sponsor.location, currentLang);

  return (
    <Link href={`/sponsors/${sponsor.slug}`} className="block h-full group focus:outline-none">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
      >
        <div className="relative w-full h-40 sm:h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100/50">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-green/10 rounded-full blur-3xl" />

          <div className="relative w-full h-full flex justify-center items-center group-hover:scale-105 transition-transform duration-500">
            <Image
              src={getOptimizedImageUrl(imgSrc, { width: 400, quality: "auto", format: "auto" })}
              alt={`${name} logo`}
              width={200}
              height={100}
              loading="lazy"
              className="object-contain max-h-full opacity-90 group-hover:opacity-100 drop-shadow-sm transition-opacity duration-300"
              onError={() => setImgSrc("/assets/aboutus.webp")}
            />
          </div>
        </div>

        <div className="p-6 sm:p-7 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block text-xs font-bold text-dark-green bg-green/10 px-3 py-1 rounded-full font-nunito tracking-wide">
              {category}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-dark-green font-nunito mb-3 group-hover:text-green transition-colors duration-300 leading-snug">
            {name}
          </h3>

          <p className="text-sm text-gray-500 font-nunito leading-relaxed line-clamp-3 mb-6 flex-grow">
            {shortDescription}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            {location ? (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-nunito font-medium">
                <Icon icon="mdi:map-marker-outline" className="text-green text-sm flex-shrink-0" />
                <span className="truncate max-w-[120px]">{location}</span>
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5 text-sm font-bold text-dark-green group-hover:text-yellow transition-colors font-nunito">
              <span>{t("View Profile")}</span>
              <Icon
                icon="lucide:arrow-right"
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default SponsorCard;
