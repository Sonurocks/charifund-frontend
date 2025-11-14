"use client";
import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { DynamicButtonProps } from "@/src/types";

const Button: React.FC<DynamicButtonProps> = ({
  type = "button",
  text,
  icon = "mdi:arrow-top-right",
  hoverBg = "before:bg-green",
  textColor = "text-foreground",
  hoverTextColor = "group-hover:text-white",
  bgColor = "bg-yellow",
  onClick,
  disabled = false,
  children,
  rounded = "rounded-full",
  paddingx = "px-10",
  paddingy = "py-4",
  fontWeight = 'font-semibold',
}) => {
  const iconControls = useAnimationControls();
  const { t } = useTranslation();

  // Unified content block
  const buttonContent = (
    <div
      className={`flex items-center justify-center gap-2 relative z-10 font-bold transition-colors duration-300 ${textColor} ${hoverTextColor} whitespace-nowrap`}
    >
      <span className="leading-none">{children ? children : text ? t(text) : ""}</span>
      {icon && (
        <motion.div
          className="flex items-center justify-center leading-none"
          animate={iconControls}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Icon icon={icon} width={18} height={18} />
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => iconControls.start({ rotate: 45 })}
      onHoverEnd={() => iconControls.start({ rotate: 0 })}
      whileHover="hover"
      variants={{
        hover: {
          backgroundSize: "100% 100%",
          transition: { duration: 0.4, ease: "easeInOut" },
        },
      }}
      className={`w-full relative  cursor-pointer ${fontWeight} font-nunito
        ${bgColor}   ${rounded} ${paddingx} ${paddingy} 
        overflow-hidden group
        before:content-[''] before:absolute before:inset-0 ${hoverBg}
        before:transition-transform before:duration-500 
        before:origin-center before:scale-x-0 hover:before:scale-x-100 before:z-0
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;
