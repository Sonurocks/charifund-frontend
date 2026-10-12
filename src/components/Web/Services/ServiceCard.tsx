"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { ServiceItem } from "@/src/static-resource/services";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState(service.image || "/assets/aboutus.webp");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
    >
      {/* Image Container with subtle zoom on hover */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <Image
          src={getOptimizedImageUrl(imgSrc, { width: 600, quality: "auto", format: "auto" })}
          alt={t(service.titleKey)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/assets/aboutus.webp")}
        />
        {/* Subtle overlay to blend the image gently */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
        
        {/* Icon sitting on the image */}
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/95 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm">
          <Icon icon={service.icon} className="w-6 h-6 text-dark-green" />
        </div>
      </div>

      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-extrabold text-dark-green mb-3 group-hover:text-green transition-colors leading-snug">
          {t(service.titleKey)}
        </h3>

        {/* Description */}
        <p className="text-gray-green text-sm leading-relaxed mb-6 font-nunito flex-grow">
          {t(service.descKey)}
        </p>

        {/* Action Link */}
        <div className="mt-auto">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-dark-green group-hover:text-yellow transition-colors"
          >
            <span>{t("Learn More")}</span>
            <Icon
              icon="lucide:arrow-right"
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
