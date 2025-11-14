"use client";
import React from "react";
import Image from "next/image";
import { DonationCardProps } from "@/src/types/web/donateUs";
import FadeInUp from "@/src/animations/FadeInUp";
import Button from "../Buttons/Button";
import { useRouter } from "next/navigation";

const DonationCard: React.FC<DonationCardProps> = ({
  icon,
  subtitle,
  title,
  buttonText,
  onButtonClick,
  backgroundImage,
}) => {

  const router = useRouter();
  const handleCardClick = () => {
  router.push('/contact');
  }
  return (
    <FadeInUp className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center text-center">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
    
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* ✅ Content */}
      <div className="relative z-10 text-white p-6 flex flex-col items-center justify-center space-y-5">
        {/* Icon */}
        {icon && (
          <div className="mb-7 w-20 h-20 relative">
            <Image src={icon} alt="Card Icon" fill className="object-contain" />
          </div>
        )}

        {/* Subtitle */}
        <p className="text-sm text-gray-200 mb-2">{subtitle}</p>

        {/* Title */}
        <h3 className="text-3xl font-bold leading-snug mb-12">{title}</h3>

        {/* Button */}
        <div className="w-fit">
          <Button text={buttonText} onClick={handleCardClick} />
        </div>
      </div>
    </FadeInUp>
  );
};

export default DonationCard;
