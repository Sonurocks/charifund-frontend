


"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ArrowButton from "../../UI/web/Buttons/ArrowButton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useInView } from "framer-motion";

import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { bgOneVolunteer, image99, valueableshape } from "@/public/assets";
import { fetchFeedback } from "@/src/services/web/client/clientServices";
import { useHomeOverview } from "@/src/hooks/web/useHomeOverview";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";
import StarRating from "../../UI/web/StarRating";
import ComponentLabel from "../../UI/web/ComponentLabel";
import ComponentTitle from "../../UI/web/ComponentTitle";

const truncateText = (text: string, maxLength: number): string =>
  !text ? "" : text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const ValueableCustomer = () => {
  const { t } = useTranslation();

  const { data: overview, isLoading: isOverviewLoading } = useHomeOverview();
  const hasOverviewFeedbacks = Boolean(overview?.feedbacks?.length);

  const { data: individualFeedbacks = [], isLoading: isFeedbackLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: fetchFeedback,
    enabled: !isOverviewLoading && !hasOverviewFeedbacks,
  });

  const feedbacks = hasOverviewFeedbacks ? overview.feedbacks : individualFeedbacks;
  const isLoading = hasOverviewFeedbacks ? false : (isOverviewLoading || isFeedbackLoading);

  const validFeedbacks = feedbacks.filter(
    (f: any) => f.name && f.feedback && f.rating && f.image
  );

  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  if (isLoading) return <CustomLoader />;
  if (validFeedbacks.length === 0) return null;

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center pt-3 sm:py-12 md:py-16 pb-16 xl:pb-48"
      style={{ backgroundImage: `url(${bgOneVolunteer.src})` }}
    >
      {/* Background shape */}
      <div
        className="absolute top-0 left-0 w-[80%] sm:w-[70%] md:w-[60%] h-[30%] bg-no-repeat bg-contain z-10"
        style={{ backgroundImage: `url(${valueableshape.src})` }}
      />

      {/* Heading */}
      <div
        ref={headerRef}
        className="mt-20 md:mt-[140px] px-4 sm:px-6 md:px-8 relative z-20 flex justify-center items-center"
      >
        <div className="lg:max-w-[700px]">
          <ComponentLabel
            className="text-center"
            text="Together for a Better Society"
            isVisible={isHeaderInView}
          />
          <ComponentTitle
            className="lg:text-center"
            preText="Our Supporters & Partners –"
            highlightText="Their Valuable"
            postText="Feedback"
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-8 sm:mt-10 px-4 sm:px-6 md:px-8 xl:px-20">
        <Swiper
          spaceBetween={25}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          loop
          autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
          speed={1000}
          modules={[Navigation, Autoplay]}
          className="pb-12"
        >
          {validFeedbacks.map((item: any, idx: number) => (
            <SwiperSlide key={`${item.id || item.name}-${idx}`}>
              <div className="relative bg-white border border-yellow rounded-3xl shadow-sm px-4 sm:px-6 py-6 sm:py-8 w-full max-w-[456px] min-h-[360px] mx-auto flex flex-col">
                {/* Decorative Icon */}
                <Image
                  src={image99}
                  alt="quote"
                  width={106}
                  height={88}
                  className="absolute top-4 right-4 opacity-10 w-6 h-5 sm:w-8 sm:h-7 md:w-[76.79px] md:h-[63.75px] xl:w-[106px] xl:h-[88px]"
                />

                {/* Rating */}
                <StarRating
                  rating={item.rating || 0}
                  size={20}
                  className="mb-3 text-yellow"
                />

                {/* Feedback Text */}
                <p className="text-gray-500 font-nunito text-base leading-relaxed">
                  "{truncateText(t(item.feedback), 230)}"
                </p>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* User Info */}
                <div className="flex items-center mt-6 gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={getOptimizedImageUrl(item.image || item.avatar, { width: 96, height: 96, quality: "auto", format: "auto", crop: "thumb" })}
                      alt={item.name}
                      width={48}
                      height={48}
                      sizes="48px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold font-nunito text-base text-foreground">
                      {t(item.name)}
                    </h4>
                    <p className="text-gray-500 font-nunito text-sm">
                      {t(item.designation || item.role)}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <div className="flex justify-center items-center mt-6 lg:mt-10 space-x-4">
          <div className="swiper-button-prev-custom">
            <ArrowButton direction="left" size={60} />
          </div>
          <div className="swiper-button-next-custom">
            <ArrowButton direction="right" size={60} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueableCustomer;
