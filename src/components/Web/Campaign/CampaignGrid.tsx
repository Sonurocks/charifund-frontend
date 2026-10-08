"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import CustomLoader from "../../UI/web/Loader/CustomLoader";
import CampaignCard from "./CampaignCard";
import { useFetchAllCampaigns } from "@/src/hooks/web/useCampaigns";
import ComponentLabel from "../../UI/web/ComponentLabel";
import ComponentTitle from "../../UI/web/ComponentTitle";
import CarouselIndicators from "../Home/HelpAndDonate/CarouselIndicators";
import ArrowButton from "../../UI/web/Buttons/ArrowButton";

const CampaignGrid = () => {
    const router = useRouter();
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    const [page, setPage] = useState(1);
    const { data, isLoading, isError }: any = useFetchAllCampaigns(page, 20); // pull enough for carousel

    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [leftButtonColor, setLeftButtonColor] = useState<"yellow" | "green">("green");
    const [rightButtonColor, setRightButtonColor] = useState<"yellow" | "green">("yellow");
    const swiperRef = useRef<SwiperType | null>(null);

    const campaignsToDisplay = useMemo(() => {
        if (!(data as any)?.campaigns) return [];
        return (data as any).campaigns.map((campaign: any) => ({
            id: campaign._id || campaign.id,
            image: campaign.images?.[0] || "/default-image.webp",
            category: campaign.category,
            title: campaign.title,
            description: campaign.description,
            progress: campaign.goalAmount > 0 ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0,
            raised: `₹${campaign.raisedAmount}`,
            goal: `₹${campaign.goalAmount}`,
        }));
    }, [data]);

    const handleCardClick = useCallback((id?: string) => {
        if (!id) return;
        router.push(`/campaign/${id}`);
    }, [router]);

    const handlePrev = useCallback(() => {
        swiperRef.current?.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        swiperRef.current?.slideNext();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-20 min-h-[500px] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-0 max-w-7xl">
                <div ref={headerRef} className="flex justify-center items-center">
                    <div className="lg:text-center lg:max-w-[830px] mb-5">
                        <ComponentLabel
                            text="Start Donating Poor People"
                            isVisible={isHeaderInView}
                        />
                        <ComponentTitle
                            preText="Be The Reason Of Someone's"
                            highlightText="Smile"
                            postText=""
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="col-span-full text-center py-8 flex justify-center">
                        <CustomLoader />
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-red">Failed to load campaigns. Please try again.</p>
                    </div>
                ) : campaignsToDisplay.length > 0 ? (
                    <div
                        className="relative lg:px-15 xl:px-0 mt-8"
                        onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
                        onMouseLeave={() => swiperRef.current?.autoplay?.start()}
                    >
                        <style dangerouslySetInnerHTML={{__html: `
                            .campaign-swiper-grid { padding-bottom: 20px !important; }
                            .campaign-swiper-grid .swiper-wrapper { align-items: stretch !important; }
                            .campaign-swiper-grid .swiper-slide { height: auto !important; display: flex !important; justify-content: center; }
                        `}} />
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
                            className="h-full campaign-swiper-grid"
                            navigation={false}
                            style={{ "--swiper-navigation-size": "0px" } as React.CSSProperties}
                        >
                            {campaignsToDisplay.map((card: any, index: number) => (
                                <SwiperSlide key={card.id || index} className="w-full">
                                    <div className="flex justify-center w-full h-full">
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

                        {campaignsToDisplay.length > 1 && (
                            <div className="flex flex-col items-center mt-6 lg:mt-10 gap-6 w-full">
                                {/* Pagination Dots */}
                                <CarouselIndicators
                                    length={campaignsToDisplay.length}
                                    activeIndex={activeIndex}
                                    onDotClick={(index) => swiperRef.current?.slideTo(index)}
                                />

                                {/* Navigation Arrows */}
                                <div className="flex justify-center items-center gap-4 md:gap-6 w-full">
                                    <ArrowButton
                                        direction="left"
                                        onClick={handlePrev}
                                        size={55}
                                        className={`shadow-md hover:scale-105 transition-transform cursor-pointer ${
                                            leftButtonColor === "green"
                                                ? "bg-dark-green text-white hover:bg-yellow hover:text-black"
                                                : "bg-yellow text-black hover:bg-dark-green hover:text-white"
                                        }`}
                                    />
                                    
                                    <ArrowButton
                                        direction="right"
                                        onClick={handleNext}
                                        size={55}
                                        className={`shadow-md hover:scale-105 transition-transform cursor-pointer ${
                                            rightButtonColor === "yellow"
                                                ? "bg-yellow text-black hover:bg-dark-green hover:text-white"
                                                : "bg-dark-green text-white hover:bg-yellow hover:text-black"
                                        }`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No campaigns found.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CampaignGrid;
