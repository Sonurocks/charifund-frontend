'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CharityCard from './CharityCard';
import { hand } from '@/public/assets';

import ArrowButton from '@/src/components/Button';

import FadeUpCard from '@/src/animations/FadeButtomUp';
import SlideinFromLeft from '@/src/animations/SlideInFromLeft';
import { useTranslation } from 'react-i18next';
import { charityCards } from '@/src/staticResource';
import ComponentLabel from '@/src/components/UI/web/ComponentLabel';
import ComponentTitle from '@/src/components/UI/web/ComponentTitle';

export default function CharityWithDifference() {
  // Animation refs
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const swiperRef = useRef<SwiperType | null>(null);
  const { t } = useTranslation();

  return (
    <div className="bg-white overflow-hidden py-4  lg:py-4 px-4 relative">
      <div className="max-w-7xl mx-auto mt-15">
        {/* Header Section */}
        <FadeUpCard delay={0.3}>
          <div ref={headerRef} className="md:text-center mb-4 lg:mb-6 relative z-10">

            <ComponentLabel
              text="Start Donating Poor People"
              isVisible={isHeaderInView}
            />
            <ComponentTitle
              preText="Charity With Difference"
              highlightText=""
              postText=" "
            />
            <motion.p
              className="text-gray-green text-[16px] font-semibold max-w-[780px] font-nunito lg:max-w-2xl xl:max-w-3xl md:text-[16px] md:tracking-tight font-nunito xl:tracking-wide leading-7 mx-auto"
              style={{ fontWeight: '400', marginTop: '20px' }}
              initial={{ opacity: 0, transform: 'translateZ(0)' }}
              animate={isHeaderInView ? { opacity: 1, transform: 'translateZ(0)' } : { opacity: 0, transform: 'translateZ(0)' }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {t("Join Our Monthly Giving Program To Provide Consistent Support To Our Initiatives. Regular Contributions, No Matter The Size, Help Us Plan And Sustain Long-Term Projects.")}
            </motion.p>
          </div>
        </FadeUpCard>
        {/* Decorative Hand */}
        <SlideinFromLeft delay={0.5}>
          <motion.div
            className="absolute w-8 h-8 xs:w-11 xs:h-11 md:w-20 md:h-20 lg:w-30 lg:h-30 xl:w-40 xl:h-40 top-4 left-1 opacity-60 z-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.6,
              y: [0, -90, 50]
            }}
            transition={{
              opacity: { duration: 0.3, delay: 0.3, },
              y: {
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          >
            <div className="relative">
              <Image
                src={hand}
                alt="Hand with heart"
                width={160}
                height={160}
                className="object-contain w-full h-full"
              />

            </div>
          </motion.div>

        </SlideinFromLeft>

        {/* Swiper Section */}
        <div
          className="relative z-10"
          onMouseEnter={() => {
            if (swiperRef.current && swiperRef.current.autoplay) {
              swiperRef.current.autoplay.stop();
            }
          }}
          onMouseLeave={() => {
            if (swiperRef.current && swiperRef.current.autoplay) {
              swiperRef.current.autoplay.start();
            }
          }}
        >
          <div className='md:px-14 lg:px-15 xl:px-8 mx-auto'>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                0: {
                  slidesPerView: 0,
                  spaceBetween: 4,
                  centeredSlides: false,
                },
                300: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                  centeredSlides: true,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 15,
                  centeredSlides: true,
                },
                700: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                  centeredSlides: true,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                  centeredSlides: false,
                },
                1440: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                  centeredSlides: false,
                },
              }}
              className="font-nunito font-semibold"
              speed={990}
            >
              {charityCards.map((card) => (
                <SwiperSlide key={card.id}>
                  <CharityCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    color={card.color}
                    bgColor={card.bgColor}
                    isTransitioning={false}
                    animationDelay={0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex justify-center items-center mt-6 lg:mt-10 space-x-4">
            <div className="swiper-button-prev-custom">
              <ArrowButton direction="left" size={60} />
            </div>
            <div className="swiper-button-next-custom">
              <ArrowButton direction="right" size={60} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
