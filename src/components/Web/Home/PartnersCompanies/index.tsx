"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { PartnersCompaniesData } from "@/src/staticResource";

const PartnersCompanies = () => {
  return (
    <div className="w-full bg-[var(--gray-200)] py-16 overflow-hidden">
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay]}
          loop={true} 
          slidesPerView={5} 
          spaceBetween={40}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false, 
          }}
          speed={800}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
             649: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 40,
            },
          }}
        >
          {PartnersCompaniesData.map((logo, idx) => (
            <SwiperSlide key={idx} className="flex justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={80}
                className="object-contain grayscale hover:grayscale-0 transition duration-300"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PartnersCompanies;
