"use client";

import React from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Icon } from "@iconify/react";
import { CancelButtonProps } from "@/src/types";
const CancelButton: React.FC<CancelButtonProps> = ({ text, onClose, icon,paddingX="px-4",paddingY="py-2",rounded="rounded-md",textSize='' }) => {
  const iconControls = useAnimationControls();

  return (
    <motion.button
      type="button"
      onClick={onClose}
      disabled={false}
      onHoverStart={() => iconControls.start({ rotate: 90 })}
      onHoverEnd={() => iconControls.start({ rotate: 0 })}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { backgroundSize: "0% 100%", backgroundPosition: "center" },
        hover: {
          backgroundSize: "100% 100%",
          transition: { duration: 0.4, ease: "easeInOut" },
        },
      }}
      className={`
        w-full  relative cursor-pointer font-semibold font-nunito
        bg-red text-white overflow-hidden group
        ${paddingX} ${paddingY} ${rounded}
        before:content-[''] before:absolute before:inset-0 before:bg-red-50
        before:transition-transform before:duration-500
        before:origin-center before:scale-x-0 hover:before:scale-x-100 before:z-0
      `}
    >
      <div
        className={`
          flex items-center justify-center gap-2 relative z-10 
          transition-colors duration-300 group-hover:text-white whitespace-nowrap
        `}
      >
        {icon && (
          <motion.div
            animate={iconControls}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Icon icon={icon} width={18} height={18} />
          </motion.div>
        )}
        <span className={` ${textSize}`}>{text}</span>
      </div>
    </motion.button>
  );
};

export default CancelButton;
