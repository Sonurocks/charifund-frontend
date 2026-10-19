
"use client";

import React from "react";
import { motion } from "framer-motion";
import AnimatedProgressBar from "../../UI/web/AnimatedProgressBar";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CampaignCardProps } from "@/src/types/web/campaign";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

const CampaignCard: React.FC<CampaignCardProps> = ({
  card,
  isInView,
  hoveredCard,
  onMouseEnter,
  onMouseLeave,
  onCardClick,
}) => {
  if (!card) {
    return (
      <div className="bg-gray-100 rounded-2xl shadow-lg p-6 flex flex-col h-full">
        <p className="text-gray-500">No campaign data available</p>
      </div>
    );
  }
  const desc = card.description || "No description available";
  const title = card.title || "No Title";

  const { t } = useTranslation();

  return (
    <div
      key={card.id}
      className="bg-white rounded-2xl shadow-lg p-2.5 space-y-3 border-white overflow-hidden relative flex flex-col h-full min-h-[380px] w-full mx-auto"
      onMouseEnter={() => card.id && onMouseEnter(card.id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Image with White Border */}
      <div
        className="relative w-full h-[200px] 2xl:h-[205px] rounded-2xl overflow-hidden cursor-pointer border-white"
        onClick={() => onCardClick(card.id)}
      >
        {card.image ? (
          <Image
            src={getOptimizedImageUrl(card.image, { width: 600, quality: "auto", format: "auto" })}
            alt={card.title || "Campaign Image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            className={`object-cover transition-transform duration-500 ease-out ${
              hoveredCard === card.id ? "scale-110 rotate-1" : "scale-100 rotate-0"
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-green">No Image</span>
          </div>
        )}

        {/* Category Pill */}
        <span
          className={`absolute top-3 left-3 text-sm xl:text-lg font-medium px-4 py-2 rounded-full font-nunito ${
            hoveredCard === card.id ? "bg-dark-green text-white" : "bg-yellow text-foreground"
          }`}
        >
          {card.category || "No Category"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 onClick={() => onCardClick(card.id)} className="text-[17px] xl:text-xl font-extrabold cursor-pointer mb-2 font-nunito transition-colors duration-300 text-dark-green hover:text-olive-brown">{title}</h3>
        <p className="text-gray-green text-xs lg:text-[14px] leading-5 font-nunito">{desc}</p>
      </div>
        <div className="bg-gray-light p-4 rounded-lg mt-auto flex justify-center w-full">
          <div className={`w-fit transition-all duration-300 ${hoveredCard === card.id ? 'group' : ''}`}>
            <Link
              href={('actionRoute' in card && (card as any).actionRoute) ? ((card as any).actionRoute as string) : `/donate-us/${card.id}`}
              className={`inline-block w-full relative cursor-pointer font-semibold font-nunito
                bg-white border-[1.5px] border-dark-green rounded-full px-3 md:px-4 lg:px-6 py-2.5 lg:py-3 
                overflow-hidden group
                before:content-[''] before:absolute before:-inset-[0.5px] before:bg-dark-green 
                before:transition-transform before:duration-500 before:rounded-full 
                before:origin-center before:scale-x-0 ${hoveredCard === card.id ? 'before:scale-x-100' : 'hover:before:scale-x-100'} before:z-0`}
            >
              <div className={`flex items-center justify-center gap-2 relative z-10 font-bold transition-colors duration-300 whitespace-nowrap font-nunito ${
                hoveredCard === card.id ? 'text-white' : 'text-dark-green group-hover:text-white'
              }`}>
                <span className="leading-none text-sm">
                  {('actionText' in card && card.actionText) ? ((card as any).actionText as string) : t("Donate Now →")}
                </span>
              </div>
            </Link>
          </div>
        </div>
    </div>
  );
};

export default CampaignCard;
