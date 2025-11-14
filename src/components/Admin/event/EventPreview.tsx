"use client";

import React, { useEffect, useState } from "react";
import { EventFormValues } from "@/src/utils/validations/FormValidation";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { motion } from "framer-motion";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import Button from "../../UI/web/Buttons/Button";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { EventPreviewProps } from "@/src/types/admin";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import Image from "next/image"; 


const EventPreview = ({ data, onSubmit, onBack, mode,showButton=true,createMutation,updateMutation }: EventPreviewProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { language, toggleLanguage } = useLanguageToggle();
  useEffect(() => {
    if (!data.images && !data.existingImages) return;

    const previews: string[] = [];

    if (data.existingImages?.length) {
      previews.push(...data.existingImages);
    }

    if (data.images?.length) {
      data.images.forEach((img) => {
        if (img && typeof img === "object" && img instanceof Blob) {
          const objectUrl = URL.createObjectURL(img);
          previews.push(objectUrl);
        } else if (typeof img === "string") {
          previews.push(img);
        }
      });
    }

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [data.images, data.existingImages]);
  const bannerImage = imagePreviews[0] || null;
  const gridImages = imagePreviews.slice(1);
  const lang=language
  const formatDate = (dateStr?:  Date|null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (dateStr?: Date|null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};
  return (
    <motion.div
      className="bg-white lg:px-4 py-8 max-w-5xl mx-auto font-sans text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <LanguageToggle language={language} onChange={toggleLanguage} />
      {/* Banner Image */}
      {bannerImage && (
        <div className="w-full h-64 sm:h-80 mb-8 rounded-xl overflow-hidden">
          
          <Image
            src={bannerImage}
            alt="Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Date & Location */}
      <div className="flex flex-row justify-baseline gap-x-10 mb-6 text-foreground font-medium">
        {data.createdAt && (
          <p className="flex items-center text-[16px] gap-2">
            <FaCalendarAlt className="text-yellow" />
            {data.createdAt.split("T")[0]}
          </p>
        )}
        {data.location && (
          <p className="flex items-center text-[16px] gap-2">
            <MdLocationPin className="text-yellow" />
            {data.location?.[lang]}<br/>
            {" Latitude: "}{data.latitude}
            {" Longitude: "}{data.longitude}
          </p>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl lg:text-4xl font-bold mb-4 font-nunito text-foreground">
        {data.title?.[lang]}
      </h2>

      {/* Description / Summary / Goal */}
      <div className="space-y-4 text-foreground/60 font-[400] text-md lg:text-lg leading-relaxed">
        <p>{data.description?.[lang]}</p>
        <p>{data.summary?.[lang]}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-foreground font-medium">
        <p className="flex items-center gap-2"><FaCalendarAlt /> Start: {formatDate(data.startDate)} </p>
        <p className="flex items-center gap-2"><FaClock /> {formatTime(data.startTime)}</p>
        <p className="flex items-center gap-2"><FaCalendarAlt /> End: {formatDate(data.endDate)}</p>
        <p className="flex items-center gap-2"><FaClock /> {formatTime(data.endTime)}</p>
        </div>
      </div>

      {/* Image Grid */}
      {gridImages.length > 0 && (
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {gridImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full h-40 rounded-lg overflow-hidden"
            >
              
              <Image
                src={img}
                alt={`Event image ${idx + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      {showButton&&(
        <div className="mt-12 flex gap-6 justify-end md:w-fit">
          <Button
            bgColor="bg-red"
            rounded="rounded-lg"
            hoverBg="before:bg-red-50"
            onClick={onBack}
            icon=""
          >
            {lang === "hi" ? "संपादन पर वापस जाएं" : "Back to Edit"}
          </Button>

          <Button
            rounded="rounded-lg"
            onClick={onSubmit}
            bgColor="bg-lime-green"
            hoverBg="before:bg-green"
            icon=""
          >
            {createMutation?.isPending || updateMutation?.isPending ? (
                      <ButtonLoader />
                    ) : <>{lang === "hi" ? "सबमिट" : "Submit"}</>}
                  </Button>
        </div>
        )}
    </motion.div>
  );
};

export default EventPreview;
