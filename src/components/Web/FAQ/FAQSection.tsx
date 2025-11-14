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
    <div className="w-full lg:flex relative lg:h-[800px] xl:h-[900px]  md:gap-8 items-start bg-white  overflow-hidden">
      {/* Left Side - FAQ */}
      <div className="lg:w-2/3 px-3 py-5 md:px-10 lg:px-0 xl:px-16  xl:mb-50 mx-auto 2xl:max-w-2xl lg:pl-15  ">
        <div ref={headerRef} >
          <ComponentLabel
            className='md:justify-center'
            text="Start Donating Poor People"
            isVisible={isHeaderInView}
          />
          <ComponentTitle
            className='lg:justify-center'
            preText="Frequently "
            highlightText="Asked"
            postText="Questions"
          />
        </div>
        <FadeInUp>
          <div className="lg:absolute  lg:z-20 xl:z-0 lg:max-w-2xl">
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
