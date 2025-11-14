"use client";
import { motion } from "framer-motion";
import { FadeInUpProps } from "../types";

const FadeInUp = ({ children, delay = 0, className = "", initialYExis = 40 }: FadeInUpProps) => (

  <motion.div
    initial={{ opacity: 0, y: initialYExis }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeInUp;
