'use client'
import { FAQAccordionItemProps } from "@/src/types/web/faq";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FAQAccordion = ({ item, isOpen, onClick }: FAQAccordionItemProps) => {
  const{t}=useTranslation();
  return (
    <motion.div
      layout
      className={`${
        isOpen ? "rounded-4xl" : "rounded-4xl"
      } overflow-hidden border border-gray-200`}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <button
        onClick={onClick}
        className={`w-full cursor-pointer text-left px-6 py-6 flex justify-between items-center transition-all duration-300 ${
          isOpen
            ? "bg-green text-white rounded-t-3xl"
            : "bg-white text-[#122F2A] font-extrabold rounded-3xl"
        }`}
      >
        
        <span className="font-semibold font-nunito lg:text-[18px] 2xl:text-[20px]">{t(item.question)}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Icon icon="mdi:chevron-down" width={24} height={24} />
        </motion.span>
      </button>

      {isOpen && (
        <motion.div
          layout
          className="px-6 py-4 md:px-10 md:py-6 bg-white font-medium text-[15px] md:text-[17px] font-nunito text-gray-green border-t border-gray-200 rounded-b-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {t(item.answer)}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FAQAccordion;
