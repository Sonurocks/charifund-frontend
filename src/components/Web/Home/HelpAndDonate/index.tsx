


"use client";

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import ArrowButton from '@/src/components/UI/web/Buttons/ArrowButton';
import { useTranslation } from "react-i18next";

import { useFetchAllCampaigns } from '@/src/hooks/web/useCampaigns';
import { allDonationCards } from '@/src/static-resource/web';

import CarouselIndicators from './CarouselIndicators';
import CampaignCard from '../../Campaign/CampaignCard';
import { CampaignApiResponse, CampaignCardInterface } from '@/src/types/web/campaign';
import ComponentLabel from '@/src/components/UI/web/ComponentLabel';
import ComponentTitle from '@/src/components/UI/web/ComponentTitle';
//import ArrowButton from '@/src/components/Button'; // ✅ your new button

const HelpAndDonate: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [leftButtonColor, setLeftButtonColor] = useState<'yellow' | 'green'>('green');
  const [rightButtonColor, setRightButtonColor] = useState<'yellow' | 'green'>('yellow');


  const swiperRef = useRef<SwiperType | null>(null);
  const spadeRef = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);

  const isSpadeInView = useInView(spadeRef, { once: true, amount: 0.3 });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { data: campaignsData, isLoading } = useFetchAllCampaigns(1, 8) as {
    data: { campaigns: CampaignApiResponse[] },
    isLoading: boolean
  };

  const campaignsToDisplay = useMemo(() => {
    if (campaignsData?.campaigns?.length) {
      return campaignsData.campaigns.map((campaign: any) => {
        const progress = campaign.goalAmount > 0
          ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
          : 0;
        return {
          id: campaign.id?.toString() || Math.random().toString(),
          image: campaign.images?.[0] || "/assets/helpforeducation.webp",
          category: campaign.category || "General",
          title: campaign.title || "Campaign Title",
          description: campaign.description || "No description available",
          progress: Math.min(progress, 100),
          raised: `$${campaign.raisedAmount || 0}`,
          goal: `$${campaign.goalAmount || 0}`,
        };
      });
    }
    return allDonationCards;
  }, [campaignsData]);

  if (!isLoading && (!campaignsToDisplay.length)) return null;

  const handleCardClick = useCallback((id?: string) => {
    router.push(id ? `/campaign/${id}` : '/donation');
  }, [router]);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 lg:py-20 min-h-[400px] md:min-h-[500px] overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/bgsection3.webp')" }}
      >
        <div className="absolute inset-0 bg-black/4" />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-0 xl:px-0 max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 md:mb-12 lg:mb-6">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl mb-6 md:mb-0 flex-grow">
            <ComponentLabel
              text="Start Donating Poor People"
              isVisible={isHeaderInView}
            />
            <ComponentTitle
              preText="Help & "
              highlightText="Donate"
              postText=" Them when They are In Need"
            />
          </div>

          {campaignsToDisplay.length > 4 && (
            <div className="flex items-center gap-3 md:gap-4 mt-0 md:mt-0 ml-auto md:ml-6">
              <ArrowButton
                direction="left"
                onClick={handlePrev}
                size={55}
                className={`shadow-md hover:scale-105 transition-transform ${leftButtonColor === "green"
                    ? "bg-dark-green text-white hover:bg-yellow hover:text-black"
                    : "bg-yellow text-black hover:bg-dark-green hover:text-white"
                  }`}
              />
              <ArrowButton
                direction="right"
                onClick={handleNext}
                size={55}
                className={`shadow-md hover:scale-105 transition-transform ${rightButtonColor === "yellow"
                    ? "bg-yellow text-black hover:bg-dark-green hover:text-white"
                    : "bg-dark-green text-white hover:bg-yellow hover:text-black"
                  }`}
              />
            </div>
          )}

        </div>

        {/* Floating Spade Image */}
        <motion.div
          ref={spadeRef}
          className="absolute -left-8 md:-left-12 lg:-left-20 top-32 md:top-40 lg:top-[180px] transform -translate-y-1/2 opacity-40 hover:opacity-50 transition-opacity duration-300 hidden sm:block"
          initial={{ opacity: 0, transform: "translateZ(0)" }}
          animate={isSpadeInView ? { opacity: 1, transform: "translateZ(0)" } : { opacity: 0, transform: "translateZ(0)" }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/assets/spade.webp"
            alt="Hand outline"
            width={60}
            height={60}
            className="animate-[float_3s_ease-in-out_infinite] md:w-16 md:h-16 lg:w-20 lg:h-20"
          />
        </motion.div>

        {/* Carousel */}
        <div
          className="relative lg:px-15 xl:px-0"
          onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay?.start()}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            spaceBetween={15}
            loop={true}
            centeredSlides={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 15, centeredSlides: true },
              480: { slidesPerView: 1, spaceBetween: 15, centeredSlides: true },
              640: { slidesPerView: 1.5, spaceBetween: 18, centeredSlides: true },
              768: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
              1024: { slidesPerView: 3, spaceBetween: 22, centeredSlides: false },
              1280: { slidesPerView: 4, spaceBetween: 24, centeredSlides: false },
            }}
            speed={990}
            className="h-full"
            navigation={false}
            style={{ '--swiper-navigation-size': '0px' } as React.CSSProperties}
          >
            {campaignsToDisplay.map((card: CampaignCardInterface, index: number) => (
              <SwiperSlide key={`${card.id}-${index}`} className="h-full flex justify-center">
                <div className="h-full flex justify-center w-full">
                  <CampaignCard
                    card={card}
                    isInView={isInView}
                    hoveredCard={hoveredCard}
                    onMouseEnter={setHoveredCard}
                    onMouseLeave={() => setHoveredCard(null)}
                    onCardClick={handleCardClick}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Carousel Indicators */}
          {campaignsToDisplay.length > 1 && (
            <CarouselIndicators
              length={campaignsToDisplay.length}
              activeIndex={activeIndex}
              onDotClick={(index) => swiperRef.current?.slideTo(index)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HelpAndDonate;
