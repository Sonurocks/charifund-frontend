
"use client";
import React from "react";
import Image from "next/image";
import { FaHandHoldingHeart } from "react-icons/fa";
import ContactForm from "./ContactForm";
import ContactInfoBlock from "./ContactInfoBlock";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { useTranslation } from "react-i18next";
import { Feedback, FeedbackApiResponse } from "@/src/types/web/feedback";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useFetchApprovedFeedbacks } from "@/src/hooks/web/useFeedback";
import StarRating from "../../UI/web/StarRating";
import { contactInfo } from "@/src/staticResource";
import ArrowButton from "@/src/components/Button"; // ✅ Using your custom button

const ContactUs = () => {
  const { t } = useTranslation();
  const { data } = useFetchApprovedFeedbacks(1, 10, "all") as {
    data: FeedbackApiResponse;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const feedbacks =
    data?.feedback && Array.isArray(data.feedback)
      ? data.feedback.slice(0, 9)
      : [];

  return (
    <div className="bg-white px-4 sm:px-6 md:px-12 xl:px-20 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT SECTION */}
        <AnimatedReveal className="flex-1">
          <p className="inline-flex items-center justify-center gap-2 text-green font-caveat font-bold text-2xl mb-2">
            <FaHandHoldingHeart size={20} />
            {t("Get In Touch")}
          </p>
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] xl:text-[55px] font-nunito font-extrabold text-dark-green mb-3">
            {t("Contact Us")}
          </h1>
          <p className="text-muted-gray font-nunito text-[15px] sm:text-[16px] capitalize leading-7 md:leading-8 mb-10">
            {t(
              "Your support makes a difference. If you would like to learn more about our work, make a donation, or find out how you can volunteer, you can contact us using the information below."
            )}
          </p>

          {/* SWIPER FEEDBACK SECTION */}
          {feedbacks.length > 0 && (
            <div className="mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-dark-green mb-6 sm:mb-8 text-center lg:text-left">
                {t("What People Say")}
              </h2>

              <Swiper
                spaceBetween={12}
                slidesPerView={1}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 10 },
                  724: { slidesPerView: 2, spaceBetween: 6 },
                  768: { slidesPerView: 2, spaceBetween: 12 },
                  1020: { slidesPerView: 1, spaceBetween: 12 },
                  1220: { slidesPerView: 1, spaceBetween: 12 },
                  1280: { slidesPerView: 2, spaceBetween: 12 },
                  1536: { slidesPerView: 2, spaceBetween: 12 },
                }}
                navigation={{
                  prevEl: ".prev-btn",
                  nextEl: ".next-btn",
                }}
                loop
                autoplay={{
                  delay: 3000,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                }}
                speed={1000}
                modules={[Navigation, Autoplay]}
                className="pb-12"
              >
                {feedbacks?.map((item: Feedback, idx: number) => (
                  <SwiperSlide key={`${item.id}-${idx}`}>
                    <div className="relative bg-white border border-yellow rounded-3xl flex flex-col justify-between shadow-sm overflow-hidden px-6 py-8 w-full sm:w-[280px] md:w-[315px] lg:w-[220px] lg:h-[385.6px] xl:h-[385.6px] 2xl:w-[315.6px] 2xl:h-[385.6px] xl:w-[230px] h-auto min-h-[340px] mx-auto hover:shadow-lg transition-all duration-500 lg:w-full xl:w-full">
                      {/* Rating */}
                      <StarRating
                        rating={item.rating || 0}
                        size={20}
                        className="mb-3 text-yellow"
                      />

                      {/* Feedback */}
                      <p className="text-[#667471] font-nunito text-sm sm:text-base leading-relaxed px-2 flex-grow">
                        "{truncateText(item.feedback || "", 260)}"
                      </p>

                      {/* User Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center mt-6 px-2 gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden mx-auto sm:mx-0">
                          <Image
                            src={
                              item.image && typeof item.image === "string"
                                ? item.image
                                : "/assets/author.webp"
                            }
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col items-center sm:items-start sm:ml-3">
                          <h4 className="font-bold font-nunito text-[17px] text-foreground">
                            {item.name}
                          </h4>
                          <p className="text-gray-500 font-nunito text-[14px]">
                            {item.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* ✅ Swiper Navigation Buttons (Updated with ArrowButton) */}
              <div className="flex justify-center gap-4 mt-6 sm:mt-8">
                <div className="prev-btn">
                  <ArrowButton
                    direction="left"
                    size={56}
                    className="shadow-md hover:scale-105"
                  />
                </div>
                <div className="next-btn">
                  <ArrowButton
                    direction="right"
                    size={56}
                    className="shadow-md hover:scale-105"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10 mb-10 max-w-[700px]">
            {contactInfo.map((info, idx) => (
              <ContactInfoBlock
                key={idx}
                icon={info.icon}
                title={info.title}
                lines={info.lines}
                isSocial={info.isSocial}
                links={info.links}
              />
            ))}
          </div>

          {/* Contact Image */}
          <div className="w-full text-center mt-6">
            <Image
              src="/assets/conatctusimage.webp"
              alt="Contact Illustration"
              height={260}
              width={516}
              className="w-full h-auto object-cover"
               loading="lazy"
            />
          </div>
        </AnimatedReveal>

        {/* RIGHT SECTION */}
        <AnimatedReveal className="flex-1 bg-white">
          <div className="p-6 sm:p-8 md:p-10 rounded-xl border border-gray-200">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              {t("Fill Up The Form")}
            </h2>
            <p className="font-nunito text-base text-gray-500 mb-6">
              {t(
                "Your email address will not be published. Required fields are marked *"
              )}
            </p>
            <ContactForm />
          </div>
        </AnimatedReveal>
      </div>
    </div>
  );
};

export default ContactUs;
