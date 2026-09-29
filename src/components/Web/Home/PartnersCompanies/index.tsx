"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { getAllSponsors } from "@/src/data/sponsors";

// Duplicate sponsors list for a seamless infinite loop appearance
const sponsors = getAllSponsors();
const displaySponsors = [...sponsors, ...sponsors];

const PartnersCompanies = () => {
  return (
    <div className="w-full bg-[var(--gray-200)] py-16 overflow-hidden">
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
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
          {displaySponsors.map((sponsor, idx) => (
            <SwiperSlide key={`${sponsor.id}-${idx}`} className="flex justify-center">
              <Link
                href={`/sponsors/${sponsor.slug}`}
                title={sponsor.name}
                aria-label={`View ${sponsor.name} details`}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={120}
                  height={80}
                  className="object-contain opacity-75 hover:opacity-100 transition duration-300 cursor-pointer"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PartnersCompanies;

