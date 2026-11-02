"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RollingCounterProps {
  value: number;
  prefix?: string;
  decimals?: number;
  className?: string;
  showTrend?: boolean;
}

// Single rolling digit column [0..9] sliding vertically
const RollingDigit = ({ char }: { char: string }) => {
  const isDigit = /\d/.test(char);
  const digitNum = isDigit ? parseInt(char, 10) : 0;

  if (!isDigit) {
    return <span className="inline-block select-none">{char}</span>;
  }

  return (
    <span className="inline-block relative overflow-hidden h-[1.15em] leading-[1.15em] align-top select-none">
      <motion.span
        className="flex flex-col"
        initial={false}
        animate={{ y: `-${digitNum * 10}%` }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
          mass: 0.6,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span
            key={d}
            className="h-[1.15em] flex items-center justify-center font-bold"
          >
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

export const RollingCounter: React.FC<RollingCounterProps> = ({
  value,
  prefix = "",
  decimals = 0,
  className = "",
  showTrend = true,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [uptickDiff, setUptickDiff] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const prevValueRef = useRef(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const diff = value - prevValueRef.current;
    if (diff > 0) {
      setUptickDiff(diff);
      setIsFlashing(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsFlashing(false);
        setUptickDiff(null);
      }, 2500);
    }
    prevValueRef.current = value;
    setDisplayValue(value);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  const safeValue = Number.isFinite(displayValue) ? displayValue : 0;

  const formattedStr =
    decimals > 0
      ? safeValue.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(safeValue).toLocaleString("en-IN");

  const characters = formattedStr.split("");

  return (
    <span className={`inline-flex flex-wrap sm:flex-nowrap items-baseline gap-1.5 min-w-0 ${className}`}>
      {/* Prefix e.g. ₹ */}
      {prefix && <span className="select-none">{prefix}</span>}

      {/* Rolling Digits Container */}
      <span
        className={`inline-flex items-baseline transition-all duration-300 ${
          isFlashing
            ? "scale-[1.03] text-emerald-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]"
            : ""
        }`}
      >
        {characters.map((ch, idx) => (
          <RollingDigit key={`${idx}-${ch === "." ? "dot" : ch === "," ? "comma" : "d"}`} char={ch} />
        ))}
      </span>

      {/* Live Uptick Badge (Stock Ticker style) */}
      <AnimatePresence>
        {showTrend && isFlashing && uptickDiff && uptickDiff > 0 && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0 whitespace-nowrap shadow-xs"
          >
            <span>▲</span>
            <span>+{prefix}{uptickDiff.toLocaleString("en-IN")}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default RollingCounter;
