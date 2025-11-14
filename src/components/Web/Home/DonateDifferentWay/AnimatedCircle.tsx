
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCircleProps } from "@/src/types";


const AnimatedCircle: React.FC<AnimatedCircleProps> = ({ percentage, label }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const [displayPercent, setDisplayPercent] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(circumference);

  useEffect(() => {
    if (isInView) {
      // Animate stroke
      setStrokeOffset(circumference - (circumference * percentage) / 100);

      // Animate counter
      let current = 0;
      const duration = 1200; // ms
      const step = percentage / (duration / 20);
      const interval = setInterval(() => {
        current += step;
        if (current >= percentage) {
          current = percentage;
          clearInterval(interval);
        }
        setDisplayPercent(Math.round(current));
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isInView, circumference, percentage]);

  return (
    <div ref={ref} className="flex items-center space-x-3">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#046b59" // green color
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-dark-green">
            {displayPercent}%
          </span>
        </div>
      </div>
      <p className="text-sm md:text-base xl:text-lg font-bold text-dark-green">
        {label}
      </p>
    </div>
  );
};

export default AnimatedCircle;
