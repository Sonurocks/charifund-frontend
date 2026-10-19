"use client";

import SponsorCard from "./SponsorCard";
import ComponentLabel from "@/src/components/UI/web/ComponentLabel";
import ComponentTitle from "@/src/components/UI/web/ComponentTitle";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useFetchPublicSponsors } from "@/src/hooks/web/useSponsors";
import { FaHandshake } from "react-icons/fa";

const SponsorSkeleton = () => (
  <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-40 sm:h-48 bg-gray-200" />
    <div className="p-6 sm:p-7 flex flex-col flex-grow space-y-4">
      <div className="w-24 h-5 bg-gray-200 rounded-full" />
      <div className="w-3/4 h-6 bg-gray-200 rounded" />
      <div className="space-y-2 flex-grow">
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-5/6 h-4 bg-gray-200 rounded" />
        <div className="w-2/3 h-4 bg-gray-200 rounded" />
      </div>
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const SponsorsList = () => {
  const { data, isLoading } = useFetchPublicSponsors();
  const sponsors = data?.sponsors || [];
  const { t } = useTranslation();
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="relative bg-cover py-16 bg-center w-full bg-[url('/assets/bg-one-volunteer.webp')]">
      <div className="min-h-[80vh] flex flex-col items-center justify-start px-4 pt-8 pb-16">
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
            {t(
              "We are grateful to our sponsors and partners who share our vision of a better society. Their support makes our work possible."
            )}
          </p>
        </div>

        <div className="w-full max-w-7xl px-2">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SponsorSkeleton key={i} />
              ))}
            </div>
          ) : sponsors.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <FaHandshake className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 font-nunito mb-2">
                {t("No Sponsors Found")}
              </h3>
              <p className="text-sm text-gray-500 font-nunito">
                {t("We are continuously partnering with leading organizations. Please check back soon.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.map((sponsor, idx) => (
                <FadeUpCard key={sponsor.id || sponsor.slug || idx} delay={idx * 0.08}>
                  <SponsorCard sponsor={sponsor} />
                </FadeUpCard>
              ))}
            </div>
          )}
        </div>
      </div>

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
