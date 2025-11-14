"use client";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoArrowForwardOutline } from "react-icons/io5";

interface ArrowButtonProps {
  direction: "left" | "right";
  onClick?: () => void;
  size?: number; // overall button diameter
  className?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  onClick,
  size = 64,
  className = "",
}) => {
  const isLeft = direction === "left";

  const bgColor = isLeft ? "bg-[#122F2A]" : "bg-[#FFC107]";
  const textColor = isLeft ? "text-white" : "text-black";
  const hoverBg = isLeft ? "hover:bg-[#FFC107]" : "hover:bg-[#122F2A]";
  const hoverText = isLeft ? "group-hover:text-black" : "group-hover:text-white";

  const IconComponent = isLeft ? FaArrowLeft : IoArrowForwardOutline;

  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${bgColor} ${hoverBg} ${className}`}
      style={{ width: size, height: size }}
    >
      <IconComponent
        width={17.5}
        height={20.8}
        className={`transition-colors duration-300 ${textColor} ${hoverText} transform ${
          isLeft
            ? "scale-x-125 scale-y-115" 
            : "scale-x-[1.40] scale-y-[1.30]" 
        }`}
      />
    </button>
  );
};

export default ArrowButton;
