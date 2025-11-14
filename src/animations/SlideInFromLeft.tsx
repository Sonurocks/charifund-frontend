import { motion } from "framer-motion";
import { ReactNode } from "react";
import { slideinFromLeftProps } from "../types";

const SlideinFromLeft = ({
  children,
  className = "",
  delay = 0,
}: slideinFromLeftProps) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    className={className}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);
export default SlideinFromLeft;
