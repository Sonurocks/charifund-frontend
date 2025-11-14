"use client";

import React from "react";
import { IoMdStar } from "react-icons/io";

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  max = 5,
  className = "text-yellow",
  size = 20,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const getStarIcon = (index: number) => {
    if (index < fullStars) {
      return "full";
    } else if (index === fullStars && hasHalfStar) {
      return "half";
    } else {
      return "empty";
    }
  };

  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const starType = getStarIcon(i);
        return (
          <IoMdStar
            key={i}
            className={`w-[${size}px] h-[${size}px] ${
              starType === "full" 
                ? "fill-current" 
                : starType === "half" 
                ? "fill-current opacity-50" 
                : "fill-none stroke-current"
            }`}
            style={{
              clipPath: starType === "half" ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)" : "none"
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
