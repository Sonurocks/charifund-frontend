"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CharityCardProps } from "@/src/types";

const translations = {
  1: { titleKey: "Healthy Food", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
  2: { titleKey: "Medical Care", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
  3: { titleKey: "Child Education", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
  4: { titleKey: "Healthy Food", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
  5: { titleKey: "Medical Care", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
  6: { titleKey: "Child Education", descriptionKey: "Set Up A Secure And User-Friendly Online Donation Platform That Accepts Multiple" },
};

const colorMap: Record<string, string> = {
  "border-green-600": "var(--green)",
  "border-orange-500": "var(--orange)",
  "border-yellow-500": "var(--yellow)",
  "border-blue-500": "var(--blue)",
  "border-purple-500": "var(--purple)",
  "border-red-500": "var(--red)",
};

const iconMap: Record<number, string> = {
  1: "icon-healthy-food",
  2: "icon-medical-care",
  3: "icon-education",
  4: "icon-healthy-food",
  5: "icon-medical-care",
  6: "icon-education",
};

const CharityCard: React.FC<CharityCardProps> = ({
  id,
  title,
  description,
  color,
}) => {
  const { t } = useTranslation();

  const translated = translations[id as keyof typeof translations];
  const displayTitle = translated ? t(translated.titleKey) : title;
  const displayDescription = translated ? t(translated.descriptionKey) : description;

  const iconClass = iconMap[id] || "icon-healthy-food";
  const borderColor = colorMap[color] || "var(--green)";
  const bgImageClass = id % 3 === 0 ? "bg-image-1" : id % 3 === 1 ? "bg-image-2" : "bg-image-3";

  return (
    <motion.div
      className={`relative group rounded-[30px] flex items-center justify-center text-center overflow-hidden ${bgImageClass}`}
      style={{
        minWidth: "min(30vw, 280px)",
        width: "100%",
        height: "clamp(400px, 50vw, 450px)",
        padding: "clamp(1rem, 3vw, 2.5rem)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="mx-auto mb-4 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-x-[-1]"
          style={{
            backgroundColor: borderColor,
            width: "clamp(3.5rem, 8vw, 5rem)",
            height: "clamp(3.5rem, 8vw, 5rem)",
            marginBottom: "clamp(1rem, 3vw, 2rem)",
          }}
        >
          <i
            className={`text-white ${iconClass}`}
            style={{
              fontFamily: "FontAwesome, Arial, sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          ></i>
        </div>

        {/* Title */}
        <h3
          className="font-extrabold text-dark-green hover:text-olive-brown transition-all duration-300 mt-2"
          style={{
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
            lineHeight: "1.2",
          }}
        >
          {displayTitle}
        </h3>

        {/* Description */}
        <p
          className="text-gray-green tracking-wide"
          style={{
            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
            lineHeight: "clamp(1.4, 2vw, 1.6)",
            maxWidth: "clamp(200px, 80%, 320px)",
            margin: "0 auto",
          }}
        >
          {displayDescription}
        </p>
      </div>
    </motion.div>
  );
};

export default CharityCard;
