"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ComponentLabelProps {
    iconClassName?: string;
    text: string;
    textClassName?: string;
    isVisible: boolean;
    className?: string;
    duration?: number;
}

const ComponentLabel: React.FC<ComponentLabelProps> = ({
    iconClassName = "text-xl md:text-2xl text-green hand-icon ",
    text,
    textClassName = "text-green font-caveat text-lg md:text-[22px] xl:text-2xl font-bold",
    isVisible,
    className,
    duration = 1,
}) => {
    const { t } = useTranslation();

    return (
        <motion.div
            className={` "flex items-center  mb-4 space-x-3"   ${className}`}
            initial={{ opacity: 0, transform: 'translateZ(0)' }}
            animate={isVisible ? { opacity: 1, transform: 'translateZ(0)' } : { opacity: 0, transform: 'translateZ(0)' }}
            transition={{ duration }}
        >
            <i className={iconClassName}></i>
            <span className={textClassName}>{' '}{t(text)}</span>
        </motion.div>
    );
};

export default ComponentLabel;
