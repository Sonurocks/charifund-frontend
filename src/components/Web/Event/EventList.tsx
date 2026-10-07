"use client";
import React, { useMemo } from "react";
import CustomPagination from "../../UI/web/Pagination";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { EventListProps } from "@/src/types";
import { useFetchAllEvent } from "@/src/hooks/web/useEvent";
import EventCard from "./EventCard";
import { ApiEvent } from "@/src/types/web/event";
import EmptyState from "../../UI/web/EmptyState";
import { upcomingEvents } from "@/public/assets";
import ArrowButton from "../../UI/web/Buttons/ArrowButton";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import CarouselIndicators from "../Home/HelpAndDonate/CarouselIndicators";

type FormattedEvent = Pick<ApiEvent, "id" | "title" | "location"> & {
  date: string;
  image: string;
};

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

export default function EventList({ currentPage, onPageChange, onEmptyChange }: EventListProps) {
  const itemsPerPage = 8;
  const { data, isLoading, isError } = useFetchAllEvent(currentPage, itemsPerPage);
  
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const events = useMemo<FormattedEvent[]>(() => {
    if (!data?.events) return [];
    return data.events.map((event: ApiEvent) => ({
      id: event.id,
      title: event.title,
      location: event.location,
      date: new Date(event.startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short", // using short month so it fits inside the Pill (e.g. Oct 22, 2026)
        day: "numeric",
      }),
      image: event.images?.[0] || "/assets/events.webp",
    }));
  }, [data]);

  React.useEffect(() => {
    onEmptyChange?.(events.length === 0);
  }, [events.length, onEmptyChange]);

  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <section className="py-12 flex justify-center items-center h-64">
        <CustomLoader />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white flex justify-center items-center h-64">
        <div className="text-lg text-red">Failed to load Event data</div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className=" flex flex-col items-center justify-center w-full ">
        <EmptyState
          title="No Live Events"
          description="All events have been completed. Stay tuned for upcoming events!"
          imageSrc={upcomingEvents.src}
        />
      </section>
    );
  }

  return (
    <section className="relative py-12 min-h-[500px] overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {events.length <= 4 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event: FormattedEvent, index: number) => (
              <FadeUpCard key={event.id} delay={index * 0.2} className="h-full">
                <EventCard event={event} />
              </FadeUpCard>
            ))}
          </div>
        ) : (
          <div className="relative w-full">
            <style dangerouslySetInnerHTML={{__html: `
              .event-swiper { padding-bottom: 20px !important; }
              .event-swiper .swiper-wrapper { align-items: stretch !important; }
              .event-swiper .swiper-slide { height: auto !important; display: flex !important; }
            `}} />
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={1}
              spaceBetween={25}
              loop={true}
              autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
              speed={1000}
              navigation={{
                prevEl: ".event-swiper-button-prev",
                nextEl: ".event-swiper-button-next",
              }}
              onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
              onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }, // Based on Campaign layout
              }}
              className="w-full event-swiper"
            >
              {events.map((event: FormattedEvent, index: number) => (
                 <SwiperSlide key={event.id} className="h-auto w-full">
                   <FadeUpCard delay={index * 0.1} className="h-full">
                     <EventCard event={event} />
                   </FadeUpCard>
                 </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Unified Navigation (Dots & Arrows) matching Campaign Carousel */}
            {events.length > 1 && (
              <div className="flex flex-col items-center mt-6 lg:mt-10 gap-6 w-full">
                {/* Pagination Dots Row */}
                <CarouselIndicators
                  length={events.length}
                  activeIndex={activeIndex}
                  onDotClick={(index) => swiperRef.current?.slideTo(index)}
                />

                {/* Arrows Row */}
                <div className="flex justify-center items-center gap-4 md:gap-6 w-full">
                  <ArrowButton 
                    direction="left" 
                    size={55} 
                    className="shadow-md hover:scale-105 transition-transform cursor-pointer bg-dark-green text-white hover:bg-yellow hover:text-black"
                    onClick={() => swiperRef.current?.slidePrev()} 
                  />
                  <ArrowButton 
                    direction="right" 
                    size={55} 
                    className="shadow-md hover:scale-105 transition-transform cursor-pointer bg-yellow text-black hover:bg-dark-green hover:text-white"
                    onClick={() => swiperRef.current?.slideNext()} 
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && onPageChange && (
          <div className="flex justify-center mt-12 w-full">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
}
