
"use client";

import React from "react";
import { motion } from "framer-motion";
import AnimatedProgressBar from "../../UI/web/AnimatedProgressBar";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CampaignCardProps } from "@/src/types/web/campaign";
import Button from "../../UI/web/Buttons/Button";

const CampaignCard: React.FC<CampaignCardProps> = ({
  card,
  isInView,
  hoveredCard,
  onMouseEnter,
  onMouseLeave,
  onCardClick,
}) => {
  const router =useRouter();
  if (!card) {
    return (
      <div className="bg-gray-100 rounded-2xl shadow-lg p-6 flex flex-col h-full">
        <p className="text-gray-500">No campaign data available</p>
      </div>
    );
  }

  // ✅ Parse string or number amounts safely
  const parseAmount = (amount?: string | number) => {
    if (typeof amount === "number") return amount;
    if (typeof amount === "string") {
      return Number(amount.replace(/[^0-9.-]+/g, "")) || 0; // Remove $ or commas
    }
    return 0;
  };

  const raisedAmount = parseAmount(card.raised);
  const goalAmount = parseAmount(card.goal);
  const progress = card.progress || Math.min((raisedAmount / goalAmount) * 100, 100);

  // Truncate description
  //const maxLength=120;
  const descMaxLength = 20;
  const desc = card.description || "No description available";
  const displayText =
    desc.length > descMaxLength ? desc.slice(0, descMaxLength).concat("...") : desc;

  // Truncate title with "..."
  const titleMaxLength = 20;
  const title = card.title || "No Title";
  const displayTitle =
    title.length > titleMaxLength ? title.slice(0, titleMaxLength).concat("...") : title;
    const {t} = useTranslation();

  return (
    <div
      key={card.id}
      className="bg-white rounded-2xl shadow-lg p-2.5 space-y-3 border-white overflow-hidden relative flex flex-col  min-h-[380px]  w-full  mx-auto"
      onMouseEnter={() => card.id && onMouseEnter(card.id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Image with White Border */}
      <div className="relative w-full h-[200px] 2xl:h-[205px] rounded-2xl overflow-hidden cursor-pointer  border-white">
        {card.image ? (
          <motion.img
            src={card.image}
            alt={card.title || "Campaign Image"}
            onClick={() => onCardClick(card.id)}
            className="absolute top-0 left-0 w-full h-full object-cover"
            animate={{ 
              scale: hoveredCard === card.id ? 1.1 : 1,
              rotate: hoveredCard === card.id ? 3 : 0
            }}
            transition={{ duration: 0.5 }}
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
        <h3 onClick={() => onCardClick(card.id)} className="text-[17px] xl:text-xl font-extrabold cursor-pointer mb-2 font-nunito transition-colors duration-300 text-dark-green hover:text-olive-brown truncate">{title}</h3>
        <p className="text-gray-green text-[14px] leading-5 font-nunito line-clamp-2 flex-grow truncate">{desc}</p>

      </div>
       {/* Bottom Section */}
      <div className="bg-gray-light p-5 space-y-5 lg:space-y-6 rounded-lg mt-auto">
          <AnimatedProgressBar progress={card.progress || 0} isInView={isInView} />
            <div className="flex justify-between  text-[13px] xl:text-sm text-gray-green mt-2 font-nunito">
              <span className="text-dark-green font-nunito font-bold">Raised: {card.raised || "0"}</span>
              <span className="text-dark-green font-nunito font-bold">Goal: <span className="text-olive-brown font-bold">{card.goal || "0"}</span></span>
            </div>
          <div className={`w-fit transition-all duration-300 mt-4 ${hoveredCard === card.id ? 'group' : ''}`}>
            <button
              className={`w-fit relative cursor-pointer font-semibold font-nunito
                bg-white border-2 border-dark-green rounded-full px-6  py-2.5 lg:py-3 
                overflow-hidden group
                before:content-[''] before:absolute before:-inset-[0.5px] before:bg-dark-green 
                before:transition-transform before:duration-500 before:rounded-full 
                before:origin-center before:scale-x-0 ${hoveredCard === card.id ? 'before:scale-x-100' : 'hover:before:scale-x-100'} before:z-0`}
              onClick={() =>{router.push(`/donate-us/${card.id}`)}}
            >
              <div className={`flex items-center justify-center gap-2 relative z-10 font-bold transition-colors duration-300 whitespace-nowrap font-nunito ${
                hoveredCard === card.id ? 'text-white' : 'text-dark-green group-hover:text-white'
              }`}>
                <span className="leading-none text-sm">{t("Donate Now")}</span>
              </div>
            </button>

          </div>
        </div>
    </div>
  );
};

export default CampaignCard;
