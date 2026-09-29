"use client";

import Image from "next/image";
import Link from "next/link";
import { Sponsor } from "@/src/types/web/sponsor";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

interface SponsorCardProps {
  sponsor: Sponsor;
}

const SponsorCard = ({ sponsor }: SponsorCardProps) => {
  const { t } = useTranslation();

  return (
    <Link
      href={`/sponsors/${sponsor.slug}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-green h-full"
      aria-label={`${t("View Details")} — ${sponsor.name}`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-center h-40 bg-gray-50 px-6 py-6 border-b border-gray-100">
        <Image
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          width={160}
          height={80}
          className="object-contain w-auto h-20 opacity-75 group-hover:opacity-100 transition-all duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-5">
        <span className="inline-block text-xs font-semibold text-dark-green bg-green/10 px-2.5 py-0.5 rounded-full mb-2 font-nunito">
          {t(sponsor.category)}
        </span>
        <h3 className="text-base font-extrabold text-foreground font-nunito mb-1 group-hover:text-dark-green transition-colors duration-200">
          {sponsor.name}
        </h3>
        <p className="text-sm text-gray-500 font-nunito leading-relaxed line-clamp-2">
          {sponsor.shortDescription}
        </p>

        {sponsor.location && (
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 font-nunito">
            <Icon icon="mdi:map-marker-outline" className="text-dark-green text-sm flex-shrink-0" />
            <span>{sponsor.location}</span>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1 text-dark-green text-sm font-semibold font-nunito group-hover:gap-2 transition-all duration-200">
          {t("View Details")}
          <Icon icon="mdi:arrow-right" className="text-base" />
        </div>
      </div>
    </Link>
  );
};

export default SponsorCard;
