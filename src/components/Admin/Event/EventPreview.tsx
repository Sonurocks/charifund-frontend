"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { motion } from "framer-motion";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import Button from "../../UI/web/Buttons/Button";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { EventPreviewProps } from "@/src/types/admin";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import Image from "next/image";
import LeafletMap from "../../UI/admin/LeafletMap";

const EventPreview = ({ data, onSubmit, onBack, mode, showButton = true, createMutation, updateMutation }: EventPreviewProps) => {
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
  const lang = language;

  const formatDate = (dateStr?: Date | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr?: Date | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleOpenMap = () => {
    if (data.latitude && data.longitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`, '_blank');
    }
  };

  return (
    <motion.div
      className="bg-white lg:px-4 py-8 max-w-5xl mx-auto font-sans text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <LanguageToggle language={language} onChange={toggleLanguage} />

      {bannerImage && (
        <div className="w-full h-64 sm:h-80 mb-8 rounded-xl overflow-hidden relative">
          <Image src={bannerImage} alt="Banner" fill className="object-cover" priority />
        </div>
      )}

      <h2 className="text-2xl lg:text-4xl font-bold mb-4 font-nunito text-foreground">
        {data.title?.[lang]}
      </h2>

      <div className="flex flex-col  gap-y-4 gap-x-12 mb-6 text-foreground font-medium">
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center text-xl gap-2 font-bold">
            <FaCalendarAlt className="text-yellow" />
            {lang === "hi" ? "समय सीमा" : "Event Duration"}
          </h1>
          <p className="text-sm text-foreground/80 pl-6">
            {lang === "hi" ? "शुरू:" : "Start:"} {formatDate(data.startDate)} at {formatTime(data.startTime)}
          </p>
          <p className="text-sm text-foreground/80 pl-6">
            {lang === "hi" ? "समाप्त:" : "End:"} {formatDate(data.endDate)} at {formatTime(data.endTime)}
          </p>
        </div>

        {data.location?.[lang] && data.latitude && data.longitude && (
          <div className="flex flex-col gap-1">
            <p className="flex items-center text-xl gap-2 font-bold">
              <MdLocationPin className="text-yellow" />
              {lang === "hi" ? "स्थान" : "Location"}
            </p>
            <p className="text-sm text-blue-500 md:text-foreground/80 pl-6 cursor-pointer hover:underline hover:text-blue-500" onClick={handleOpenMap}>
              {data.location[lang]}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-1 text-foreground/60 font-[400] text-md  leading-relaxed mb-5">
        <h3 className="text-xl font-bold text-foreground">
          {lang === "hi" ? "विवरण" : "Description"}
        </h3>
        fjsdlk
        <p>{data.description?.[lang]}</p>
      </div>
      <div className="space-y-1 text-foreground/60 font-[400] text-md  leading-relaxed mb-5">
        <h3 className="text-xl font-bold text-foreground">
          {lang === "hi" ? "सारांश" : "Summary"}
        </h3>
        <p>{data.summary?.[lang]}</p>
      </div>

      {gridImages.length > 0 && (
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <h3 className="text-xl font-bold text-foreground col-span-full mb-2">
            {lang === "hi" ? "गैलरी" : "Gallery"}
          </h3>

          {gridImages.map((img, idx) => (
            <div key={idx} className="w-full h-40 rounded-lg overflow-hidden relative">
              <Image src={img} alt={`Event image ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {showButton && (
        <div className="mt-12 flex gap-6 justify-end md:w-fit">
          <Button
            bgColor="bg-red"
            rounded="rounded-lg"
            hoverBg="before:bg-red-50"
            onClick={onBack}
            icon=""
          >
            {lang === "hi" ? "संपादन" : "Edit"}
          </Button>

          <Button
            rounded="rounded-lg"
            onClick={() => onSubmit()}
            bgColor="bg-lime-green"
            hoverBg="before:bg-green"
            icon=""
          >
            {createMutation?.isPending || updateMutation?.isPending ? <ButtonLoader /> : <>{lang === "hi" ? "सबमिट" : "Submit"}</>}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default EventPreview;
