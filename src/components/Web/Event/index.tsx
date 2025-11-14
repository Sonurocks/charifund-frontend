"use client";
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import EventList from "./EventList";
import { oureventbanner } from "@/public/assets";
import { Trans, useTranslation } from "react-i18next";
import PageBanner from "@/src/helper/PageBanner";
import ComponentLabel from "../../UI/web/ComponentLabel";

export const Event = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <>
      <PageBanner bgImage={oureventbanner} title="Our Event" />

      <section className="bg-gray-100 py-16 flex justify-center items-center w-full">

        <section className="w-11/12 xl:w-10/11">
          {/* Header Section */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="animate-fade-in mb-10"
          >
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-0 sm:px-6 md:px-8">
              <ComponentLabel
                className='md:justify-center'
                text="Start Donating Poor People"
                isVisible={isHeaderInView}
              />

              <h2 className="w-full lg:max-w-[700px] text-[30px] md:text-[40px] lg:text-[52px] leading-snug font-[900] font-nunito text-dark-green mt-[15px] mb-0 lg:text-center text-left  animate-slide-up">
                <Trans i18nKey={t("Checkout Our Upcoming Full Event List")} components={{ 1: <span className="text-primaryColor" /> }} />
              </h2>
            </div>
          </motion.div>

          {/* Event List + Pagination */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <EventList
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />

          </motion.div>
        </section>
      </section>
    </>
  );
};