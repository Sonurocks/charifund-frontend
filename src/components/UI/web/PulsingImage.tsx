"use client";

import { PulsingImageProps } from "@/src/types/web/hero";
import { motion } from "framer-motion";
import Image from "next/image";


const PulsingImage: React.FC<PulsingImageProps> = ({
  src,
  alt = "pulsing-image", 
  className = "",
  duration = 3,
  scaleRange = [0.9, 1.1],
  opacityRange = [0.6, 1],
}) => {
  return (
    <motion.div
      initial={{ scale: scaleRange[0], opacity: opacityRange[0] }}
      animate={{
        scale: [scaleRange[0], scaleRange[1], scaleRange[0]],
        opacity: [opacityRange[0], opacityRange[1], opacityRange[0]],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative ${className}`}   
    >
      <Image src={src} alt={alt} fill    className="object-contain" />
    </motion.div>
  );
};

export default PulsingImage;
