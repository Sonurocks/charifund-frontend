"use client";
import { motion } from "framer-motion";
import { SlideInRightProps } from "../types";

const SlideInRight = ({ children, delay = 0, className = "" }: SlideInRightProps) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }} // start from the right
    whileInView={{ opacity: 1, x: 0 }} // move to normal position
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default SlideInRight;
