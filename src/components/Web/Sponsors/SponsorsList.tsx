"use client";

import { getAllSponsors } from "@/src/data/sponsors";
import SponsorCard from "./SponsorCard";
import ComponentLabel from "@/src/components/UI/web/ComponentLabel";
import ComponentTitle from "@/src/components/UI/web/ComponentTitle";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const SponsorsList = () => {
  const sponsors = getAllSponsors();
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="relative bg-cover py-16 bg-center w-full bg-[url('/assets/bg-one-volunteer.webp')]">
      <div className="min-h-[80vh] flex flex-col items-center justify-start px-4 pt-8 pb-16">

        {/* Section heading — mirrors Ourteam pattern */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-10">
          <ComponentLabel
            text="Together for a Better Society"
            isVisible={isHeaderInView}
            className="justify-center"
          />
          <ComponentTitle
            className="text-center"
            preText={t("Our Valued")}
            highlightText={t("Sponsors")}
            postText={t("& Partners")}
          />
          <p className="text-gray-600 font-nunito text-base md:text-lg mt-4 leading-relaxed max-w-2xl">
            {t("We are grateful to our sponsors and partners who share our vision of a better society. Their support makes our work possible.")}
          </p>
        </div>

        {/* Sponsor grid */}
        <div className="w-full max-w-7xl px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor, idx) => (
              <FadeUpCard key={sponsor.id} delay={idx * 0.1}>
                <SponsorCard sponsor={sponsor} />
              </FadeUpCard>
            ))}
          </div>
        </div>

      </div>

      {/* Decorative element — same as Ourteam */}
      <div className="absolute hidden xl:block top-[10%] right-[6%] z-[-1]">
        <Image
          src="/assets/greenspade.webp"
          alt="green spade"
          width={70}
          height={70}
          className="animate-dip-dop drop-shadow-[3px_3px_6px_rgba(0,113,93,0.9)]"
        />
      </div>
    </section>
  );
};

export default SponsorsList;
