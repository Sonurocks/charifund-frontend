"use client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { socialIcons } from "@/src/static-resource/web";
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
          <motion.div
            whileHover={{ cursor: "pointer" }}
            className="flex items-center space-x-2 transition duration-150 hover:text-yellow"
          >
            <a
              href="mailto:yuwaaindia@gmail.com"
              className="flex items-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="mdi:email-outline" className="w-5 h-5 text-yellow" />
              <span>yuwaaindia@gmail.com</span>
            </a>
          </motion.div>

          <motion.div
            whileHover={{ cursor: "pointer" }}
            className="flex items-center space-x-2 transition duration-150 hover:text-yellow"
          >
            <a
              href="tel:+918565006669"
              className="flex items-center space-x-2"
            >
              <Icon icon="mdi:phone" className="w-5 h-5 text-yellow" />
              <span>+91 85650 06669</span>
            </a>
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
                target="_blank"
                rel="noopener noreferrer"
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