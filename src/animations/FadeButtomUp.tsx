"use client";
import { motion } from "framer-motion";
import React from "react";
import { FadeUpCardProps } from "../types";


const FadeUpCard: React.FC<FadeUpCardProps> = ({ children, delay = 0 ,className='',initialYExis=100,onAnimationComplete}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: initialYExis}}     
    whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}      
      className={className}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: delay,                      
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
};

export default FadeUpCard;
