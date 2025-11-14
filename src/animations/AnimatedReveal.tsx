"use client";
import { motion, MotionProps } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";
import { AnimatedRevealProps } from "../types";



const AnimatedReveal = ({
  children,
  className = "",
  direction = "up",
  duration = 0.6,
  delay = 0,
  distance = 40,
  once = true,
  initial,
  animate,
  transition,
  ...rest
}: AnimatedRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const variants: Record<string, any> = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: -distance },
    right: { opacity: 0, x: distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={initial || variants[direction]}
      animate={
        isInView
          ? typeof animate === "object"
            ? { opacity: 1, x: 0, y: 0, ...animate }
            : { opacity: 1, x: 0, y: 0 }
          : undefined
      }
      transition={transition || { duration, delay, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedReveal;
