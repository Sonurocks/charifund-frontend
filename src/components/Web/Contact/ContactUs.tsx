
"use client";
import React from "react";
import Image from "next/image";
import { FaHandHoldingHeart } from "react-icons/fa";
import ContactForm from "./ContactForm";
import { Icon } from "@iconify/react";
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
import { contactInfo } from "@/src/static-resource/web";
import ArrowButton from "@/src/components/UI/web/Buttons/ArrowButton"; 

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
            {t("Get In Touch")}
          </p>
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] xl:text-[55px] font-nunito font-extrabold text-dark-green mb-3">
            {t("Contact Us")}
          </h1>
          <p className="text-muted-gray font-nunito text-[15px] sm:text-[16px] capitalize leading-7 md:leading-8 mb-8">
            {t(
              "Your support can make a meaningful difference. If you would like to learn more about our work, support our initiatives, volunteer with us, or collaborate with our organization, we would be happy to hear from you. Please feel free to contact us using the information below."
            )}
          </p>

          {/* Left Section List */}
          <div className="mb-10 lg:mb-14 space-y-4">
             <h3 className="text-xl sm:text-2xl font-bold font-nunito text-dark-green mb-4">
                {t("How Can We Help?")}
             </h3>
             <ul className="space-y-3 font-nunito font-semibold text-gray-700">
                {[
                  "Learn More About Our Work",
                  "Support Our Social Initiatives",
                  "Become a Volunteer",
                  "Partner or Collaborate With Us",
                  "Support Child Education & Welfare",
                  "Support Women Empowerment & Skill Development",
                  "Contribute to Health, Nutrition & Community Welfare"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-green text-2xl leading-none">•</span> 
                    <span className="text-[15.5px] tracking-wide">{t(item)}</span>
                  </li>
                ))}
             </ul>
          </div>

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
          {/* <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10 mb-10 max-w-[700px]">
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
          </div> */}

          {/* Contact Image */}
          {/* <div className="w-full text-center mt-6">
            <Image
              src="/assets/conatctusimage.webp"
              alt="Contact Illustration"
              height={260}
              width={516}
              className="w-full h-auto object-cover"
               loading="lazy"
            />
          </div> */}
        </AnimatedReveal>

        {/* RIGHT SECTION */}
        <AnimatedReveal className="flex-1 bg-white">
          <div className="p-6 sm:p-8 md:p-10 rounded-xl border border-gray-200">
            <p className="inline-flex items-center justify-center gap-2 text-green font-caveat font-bold text-2xl mb-2">
               {t("We’d Love to Hear From You")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              {t("Fill Out the Form")}
            </h2>
            <p className="font-nunito text-[15px] text-muted-gray leading-7 mb-8">
              {t("Have a question, partnership proposal, volunteering interest, or would like to support our work? Please complete the form below and our team will get back to you as soon as possible.")}
            </p>
            <ContactForm />

            <div className="mt-12 text-center lg:text-left">
               <h3 className="text-2xl font-bold font-nunito text-dark-green mb-4">
                 {t("Connect With Us")}
               </h3>
               <p className="font-nunito text-[15.5px] text-muted-gray leading-7">
                 {t("Together, we can empower communities, create opportunities, and build a more inclusive and sustainable society.")}
               </p>
            </div>
          </div>
        </AnimatedReveal>
      </div>

      {/* LOCATION SECTION */}
      <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-16">
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 font-nunito">
            {/* New Delhi */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-dark-green mb-3 flex items-center gap-2">
                 <Icon icon="mdi:office-building" width="22" height="22" className="text-green" />
                 {t("Head Office- New Delhi")}
              </h4>
              <p className="text-muted-gray text-[15px] leading-7">
                 {t("H. No. RZC-13, Khasra No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi – 110041, India")}
              </p>
            </div>
            
            {/* Gorakhpur */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-dark-green mb-3 flex items-center gap-2">
                 <Icon icon="mdi:map-marker" width="22" height="22" className="text-green" />
                 {t("Branch Office- Gorakhpur")}
              </h4>
              <p className="text-muted-gray text-[15px] leading-7">
                 {t("Behind Sankat Mochan Hanuman Mandir, Azad Nagar Colony East, Taramandal Road, Rustampur, Gorakhpur, Uttar Pradesh – 273001, India")}
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-dark-green mb-3 flex items-center gap-2">
                 <Icon icon="mdi:email" width="22" height="22" className="text-green" />
                 {t("Email")}
              </h4>
              <a href="mailto:yuwaaindia@gmail.com" className="text-muted-gray text-[15px] leading-7 hover:text-green transition-colors">
                yuwaaindia@gmail.com
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <h4 className="text-xl font-bold text-dark-green mb-3 flex items-center gap-2">
                 <Icon icon="mdi:phone" width="22" height="22" className="text-green" />
                 {t("Phone")}
              </h4>
              <a href="tel:+918565006669" className="text-muted-gray text-[15px] leading-7 block hover:text-green transition-colors">+91 85650 06669</a>
              <a href="tel:+917394886855" className="text-muted-gray text-[15px] leading-7 block hover:text-green transition-colors">+91 73948 86855</a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ContactUs;
