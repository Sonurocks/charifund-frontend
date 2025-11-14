"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { socialIcons } from "@/src/staticResource";
import LanguageSwitcher from "../../UI/web/LanguageSwitcher";

const InfoBar = () => {


  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-dark-green text-gray-100 text-sm py-2 rounded-b-2xl hidden lg:block"
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-2 space-y-2 md:space-y-0">

        {/* Left: Email & Phone */}
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ cursor: 'pointer' }} className={`flex items-center space-x-2 transition duration-111  hover:text-yellow`}>
            <Icon icon="mdi:email-outline" className={` w-5 h-5  text-yellow `} />
            <span className="">support@example.com</span>
          </motion.div>
          <motion.div whileHover={{ cursor: 'pointer' }}
            className={`flex items-center space-x-2 hover:text-yellow`}>
            <Icon icon="mdi:phone" className={` w-5 h-5  text-yellow`} />
            <span className="">+2(305) 587-3407</span>
          </motion.div>
        </div>
        {/* Right: Dropdowns & Social Icons */}
        <div className="flex items-center space-x-6 font-nunito">
          <LanguageSwitcher paddingy="py-2" />

          {/* Social Icons */}
          <div className="flex items-center space-x-4 text-gray-200">
            {socialIcons.map(({ icon, label, link }) => (
              <a
                key={label}
                href={link}
                aria-label={label}
                className={`cursor-pointer text-palate-white hover:text-yellow transition-colors duration-200`}
              >
                <Icon icon={icon} className="w-[18px] h-[18px]" />
              </a>

            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default InfoBar;