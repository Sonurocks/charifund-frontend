
"use client";
import { Icon } from "@iconify/react";
import Newsletter from "./Newsletter";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { footerData } from "@/src/staticResource";
import { logo, spade2, spreadLight } from "@/public/assets";
import Divider from "../../UI/web/HorizontalDevider";
import { useTranslation } from "react-i18next";

import CookieSettingsModal from "../../UI/web/CookieSettingsModal";

const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { t } = useTranslation();
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);


  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.25 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const underlineBase =
    "relative inline-flex items-center gap-2 text-white/50 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[1px] before:w-full before:bg-yellow before:block before:scale-x-0 before:origin-center before:transition-transform";

  const underlineOnGroupHover = `${underlineBase} text-white transition-colors group-hover:text-yellow before:duration-500 group-hover:before:scale-x-100`;
  const underlineOnHover = `${underlineBase} cursor-pointer hover:text-yellow before:duration-300 hover:before:scale-x-100`;

  return (
    <footer
      ref={ref}
      className="bg-dark-green text-white "
    >
      <section className="py-15 sm:py-14 px-4 sm:px-6 md:px-8 xl:px-28 relative">

        <Newsletter />

        {/* Floating Decorative Icon */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] left-0 xl:left-8 transform -translate-y-1/2 text-yellow  "
        >
          <Image
            src={spade2.src}
            alt="Logo"
            className="w-10 xl:w-14 h-10 xl:h-14"
            fill
          />
        </motion.div>

        {/* Main Grid */}
        <motion.div
          className="mx-auto  py-10 pb-0 lg:pb-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4  gap-10 md:gap-10 "
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {/* Brand Section */}
          <motion.div variants={item}>

            <div className="h-18 w-62 md:h-12  md:w-56 lg:h-14  lg:w-64 xl:h-16 xl:w-72 relative -ml-15 md:-ml-22">
              <Image
                src={logo}
                fill
                alt={footerData.brand.name}
                className="object-contain"
              />
            </div>
            <p className="mt-6 text-white/50 text-sm xl:text-base leading-7 w-full">
              {t(footerData.brand.description)}
            </p>
            <div className="flex gap-3 mt-6">
              {footerData.brand.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-yellow hover:text-green transition duration-200"
                >
                  <Icon icon={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h3 className="text-[20px] xl:text-2xl lg:text-[20px] 2xl:text-[24px] font-bold mb-3">
              {t("Quick Links")}
            </h3>
            <div className="w-[35%] mb-5">
              <Divider />
            </div>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link, i) => (
                <li key={i} className="group text-[16px] xl:text-base lg:text-[16px] 2xl:text-[16px]">
                  <a href={link.href} className={underlineOnGroupHover}>
                    <Icon
                      icon="mingcute:arrow-up-fill"
                      width={16}
                      height={16}
                      className="rotate-45"
                    />
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Services */}
          <motion.div variants={item}>
            <h3 className="text-[20px] xl:text-2xl lg:text-[20px] 2xl:text-[24px] font-bold mb-3">
              {t("Our Services")}
            </h3>
            <div className="w-[35%] mb-5">
              <Divider />
            </div>
            <ul className="space-y-3">
              {footerData.services.map((service, i) => (
                <li key={i} className="group text-[16px] xl:text-[16px] lg:text-[16px] 2xl:text-[16px]">
                  <a href={service.href} className={underlineOnGroupHover}>
                    <Icon
                      icon="mingcute:arrow-up-fill"
                      width={16}
                      height={16}
                      className="rotate-45"
                    />
                    {t(service.label)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Get In Touch */}
          <motion.div variants={item} className="relative">
            <h3 className="text-[20px] xl:text-2xl lg:text-[20px] 2xl:text-[24px] font-bold mb-3">
              {t("Get In Touch")}
            </h3>
            <div className="w-[35%] mb-5">
              <Divider />
            </div>
            <div className="space-y-4">
              <p className={`${underlineOnHover} text-sm xl:text-base lg:text-[20px] 2xl:text`}>
                <Icon
                  icon="ion:location"
                  width="22"
                  height="22"
                  className="text-yellow"
                />
                <span>{footerData.contact.address}</span>
              </p>
              <p className={`${underlineOnHover} text-sm xl:text-base`}>
                <Icon
                  icon="mdi:phone"
                  width="22"
                  height="22"
                  className="text-yellow"
                />
                <a href={`tel:${footerData.contact.phone_number}`}>
                  <span>{footerData.contact.phone_label}</span>
                </a>

              </p>
              <p className={`${underlineOnHover} text-sm xl:text-base`}>
                <Icon
                  icon="mdi:email"
                  width="22"
                  height="22"
                  className="text-yellow"
                />
                <a href={`mailto:${footerData.contact.email}`}>
                  <span>{footerData.contact.email}</span>
                </a>

              </p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[28%] right-10 xl:right-0 text-white"
            >
              <Image
                src={spreadLight.src}
                alt="decoration"
                className="w-12 h-12 xl:w-16 xl:h-16"
                width={12}
                height={12}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom Section */}
      <motion.div
        className="w-full border-t border-white/10  mx-auto py-15 sm:py-14 px-4 sm:px-6 md:px-8 xl:px-28 relative"
        variants={item}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 font-nunito text-[16px] xl:text-base 2xl:text-[16px] lg:text-[16px] sm:text-[16px]">
          <p className="lg:text-center text-white/70">
            © <span className="text-yellow">Charifund</span>. All Rights
            Reserved.
          </p>
          <div className="flex flex-col md:flex-row justify-baseline items-baseline lg:glex-row gap-5 md:justify-center text-white">
            {footerData.bottomLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => {
                  if (link.label === "Cookie Settings") {
                    e.preventDefault();
                    setIsCookieModalOpen(true);
                  }
                }}
                className="relative inline-flex items-center gap-2 hover:text-yellow before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[1px] before:w-full before:bg-yellow before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300"
              >
                {t(link.label)}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <CookieSettingsModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

    </footer>
  );
};

export default Footer;
