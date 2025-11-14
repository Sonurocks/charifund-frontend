


"use client";

import { FaArrowUpLong } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="relative w-14 h-14 rounded-full flex items-center justify-center 
                   shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        {/* Outer teal ring */}
        <div className="absolute inset-0 rounded-full opacity-35 bg-green"></div>
        
        {/* Progress ring - fills as user scrolls */}
        <svg className="absolute inset-0 w-14 h-14 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green opacity-30"
          />
          <circle
            cx="32"
            cy="32"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 25}`}
            strokeDashoffset={`${2 * Math.PI * 25 * (1 - scrollProgress / 100)}`}
            className="text-green "
            style={{ strokeLinecap: 'round' }}
          />
        </svg>

        {/* White inner circle */}
        <div className="absolute inset-[8px] rounded-full bg-white"></div>

        {/* Arrow Icon */}
        <FaArrowUpLong className="relative w-5 h-5 text-2xl opacity-100 text-green" />
      </button>
    </div>
  );
}
 