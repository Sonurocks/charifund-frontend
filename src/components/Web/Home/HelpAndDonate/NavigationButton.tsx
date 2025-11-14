import { NavigationButtonProps } from '@/src/types';
import React from 'react';

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  ariaLabel,
}) => {
  const isLeft = direction === 'left';

  const bgColor = color === 'yellow' ? '#FBBF24' : '#07110eff';
  const svgPath = isLeft
    ? "M7.82843 11L13.1924 5.63604L11.7782 4.22183L4 12L11.7782 19.7782L13.1924 18.364L7.82843 13H20V11H7.82843Z"
    : "M16.172 11L10.808 5.63604L12.222 4.22183L20 12L12.222 19.7782L10.808 18.364L16.172 13H4V11H16.172Z";

  const svgColorClass = isLeft
    ? (color === 'yellow' ? 'text-gray-900' : 'text-white')
    : (color === 'green' ? 'text-white' : 'text-foreground');

  const sizeClasses = isLeft ? "w-12 h-12 md:w-15 md:h-15" : "w-12 h-12 md:w-16 md:h-16";
  const hoverBgColor = isLeft ? '#FBBF24' : '#07110eff';

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${sizeClasses} rounded-full flex items-center justify-center cursor-pointer hover:bg-[${hoverBgColor}] transition-all duration-300`}
      style={{
        backgroundColor: bgColor,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
      aria-label={ariaLabel}
    >
      <svg
        className={`h-8 w-6 md:h-12 md:w-8 transition-colors duration-300 ${svgColorClass}`}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svgPath} />
      </svg>
    </button>
  );
};

export default NavigationButton;
