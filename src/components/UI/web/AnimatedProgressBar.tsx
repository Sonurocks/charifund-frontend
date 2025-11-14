"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedProgressBarProps } from '@/src/types';

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ progress, isInView }) => {
  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const duration = 1500; 
      const startTime = Date.now();
      const startValue = 0;
      const endValue = progress;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        const currentValue = Math.round(startValue + (endValue - startValue) * progressRatio);
        setDisplayProgress(currentValue);
        
        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      const timer = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(0);
    }
  }, [isInView, progress]);

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span className="text-dark-green text-[13px] xl:text-sm font-nunito font-medium">Donation</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0.8
            }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-dark-green font-medium"
          >
            {displayProgress}%
          </motion.span>
        </motion.span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div 
          className="bg-yellow-400 h-2 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${progress}%` : 0 }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2
          }}
          style={{
            background: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #FBBF24 100%)',
            backgroundSize: '200% 100%'
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: isInView ? ['0%', '100%'] : '0%',
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedProgressBar;
