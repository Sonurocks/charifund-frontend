"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useFetchPublicSponsors } from "@/src/hooks/web/useSponsors";
import { useHomeOverview } from "@/src/hooks/web/useHomeOverview";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

const PartnersCompanies = () => {
  const { data: overview, isLoading: isOverviewLoading } = useHomeOverview();
  const hasOverviewSponsors = Boolean(overview?.sponsors?.length);
  const { data } = useFetchPublicSponsors(1, 20, undefined, {
    enabled: !isOverviewLoading && !hasOverviewSponsors
  });

  const displaySponsors = useMemo(() => {
    const list = hasOverviewSponsors 
      ? overview.sponsors 
      : data?.sponsors && data.sponsors.length > 0 
      ? data.sponsors 
      : [];
    if (list.length === 0) return [];
    return [...list, ...list];
  }, [hasOverviewSponsors, overview?.sponsors, data?.sponsors]);

  if (!displaySponsors || displaySponsors.length === 0) {
    return null;
  }

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
          {displaySponsors.map((sponsor, idx) => {
            const name = typeof sponsor.name === "string" ? sponsor.name : sponsor.name?.en || "Sponsor";
            return (
              <SwiperSlide key={`${sponsor.id || sponsor.slug}-${idx}`} className="flex justify-center">
                <Link
                  href={`/sponsors/${sponsor.slug}`}
                  title={name}
                  aria-label={`View ${name} details`}
                >
                  <Image
                    src={getOptimizedImageUrl(sponsor.logo || (sponsor as any).image, { width: 240, height: 160, quality: "auto", format: "auto", crop: "fit" })}
                    alt={name}
                    width={120}
                    height={80}
                    sizes="120px"
                    className="object-contain opacity-75 hover:opacity-100 transition duration-300 cursor-pointer"
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default PartnersCompanies;
