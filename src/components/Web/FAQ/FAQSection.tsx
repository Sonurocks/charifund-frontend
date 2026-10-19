"use client";

import { useRef, useState } from "react";

import FAQList from "./FAQList";
import FAQSideImages from "./FAQSideImages";
import FadeInUp from "@/src/animations/FadeInUp";
import { useTranslation } from "react-i18next";
import ComponentTitle from "../../UI/web/ComponentTitle";
import ComponentLabel from "../../UI/web/ComponentLabel";
import { useInView } from "framer-motion";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <div className="w-full lg:flex relative lg:min-h-[800px] xl:min-h-[900px]  md:gap-0 items-stretch bg-white  overflow-hidden">
      {/* Left Side - FAQ */}
      <div className="w-full lg:w-[55%] xl:w-[55%] px-3 py-5 md:px-10 lg:px-0 xl:px-16 xl:mb-10 mx-auto 2xl:max-w-3xl lg:pl-10 xl:pl-15">
        <div ref={headerRef} >
          <ComponentLabel
            className='md:justify-center'
            text="Empowering Lives, Building a Better Society"
            isVisible={isHeaderInView}
          />
          <ComponentTitle
            className='lg:justify-center'
            preText="Frequently "
            highlightText="Asked"
            postText="Questions (FAQs)"
          />
        </div>
        <FadeInUp>
          <div className="w-full lg:max-w-[100%] xl:max-w-[700px] pt-4 lg:z-20">
            <FAQList openIndex={openIndex} setOpenIndex={setOpenIndex} />
          </div>
        </FadeInUp>
      </div>
      {/* Right Side - Images */}
      <FAQSideImages />
    </div>
  );
};

export default FAQSection;
