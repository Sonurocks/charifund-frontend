"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { BlogPreviewProps } from "@/src/types/admin";

// Dynamic imports
const Image = dynamic(() => import("next/image"), { ssr: false });
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), { ssr: false });
const ButtonLoader = dynamic(() => import("../../UI/web/Loader/ButtonLoader"), { ssr: false });
const FaCalendarAlt = dynamic(() =>
  import("react-icons/fa").then((mod) => mod.FaCalendarAlt)
);
const MdLocationPin = dynamic(() =>
  import("react-icons/md").then((mod) => mod.MdLocationPin)
);
const LucideCircleCheckBig = dynamic(() =>
  import("lucide-react").then((mod) => mod.LucideCircleCheckBig)
);
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const BlogPreview = ({
  data,
  onSubmit,
  onBack,
  showButton = true,
  createMutation,
  updateMutation,
}: BlogPreviewProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    if (!data) return;
    const seen = new Set<string>();
    const list: string[] = [];

    const addUrl = (url?: string | null) => {
      if (!url || typeof url !== "string") return;
      if (seen.has(url)) return;
      list.push(url);
      seen.add(url);
    };

    data.existingImages?.forEach((u) => addUrl(u));
    data.images?.forEach((img) => {
      if (img && typeof img === "object" && img instanceof Blob) {
        const objectUrl =
          (img as any)._objectUrl || ((img as any)._objectUrl = URL.createObjectURL(img));
        addUrl(objectUrl);
      } else if (typeof img === "string") {
        addUrl(img);
      }
    });

    setImagePreviews(list);
  }, [data]);

  const bannerImage = imagePreviews[0] || null;
  const gridImages = imagePreviews.slice(1);
  const lang = language;

  return (
    <MotionDiv
      className="bg-white lg:px-2 py-8 max-w-5xl mx-auto font-sans text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Language Toggle */}
      <div className="flex justify-start text-[13px] mb-6">
        <button
          type="button"
          className={`cursor-pointer px-2 py-1 ${lang === "en" ? "bg-lime-green text-white" : "bg-gray-200 text-gray-800"
            } rounded-l`}
          onClick={() => setLanguage("en")}
        >
          English
        </button>
        <button
          type="button"
          className={`cursor-pointer px-2 py-1 ${lang === "hi" ? "bg-lime-green text-white" : "bg-gray-200 text-gray-800"
            } rounded-r`}
          onClick={() => setLanguage("hi")}
        >
          हिंदी
        </button>
      </div>

      {/* Banner Image */}
      {bannerImage && (
        <div className="w-full h-64 sm:h-80 mb-8 rounded-xl overflow-hidden relative">
          <Image src={bannerImage} alt="Banner" fill className="object-cover" priority />
        </div>
      )}

      {/* Date & Location */}
      <div className="flex flex-col sm:flex-row justify-baseline gap-10 mb-6 text-foreground font-medium">
        {data.createdAt && (
          <p className="flex items-center text-[16px] gap-2">
            <FaCalendarAlt className="text-yellow" />
            {data.createdAt.split("T")[0]}
          </p>
        )}
        {data.location && (
          <p className="flex items-center text-[16px] gap-2">
            <MdLocationPin className="text-yellow" />
            {data.location?.[lang]}
          </p>
        )}
      </div>

      {/* Title */}
      <h2 className="text-xl lg:text-2xl font-bold mb-4 font-nunito text-foreground">
        {data.title?.[lang]}
      </h2>

      {/* Description */}
      <div className="space-y-4 text-foreground/60 font-[400] text-md lg:text-lg leading-relaxed">
        <p>{data.description?.[lang]}</p>
        <p>{data.summary?.[lang]}</p>
        <p>
          <span className="font-semibold text-foreground">Organizer:</span>{" "}
          {data.creator?.[lang] || "Admin"}
        </p>
        

        {/* Quote */}
        {data.quote?.[lang] && (
          <div className="bg-gray-100 p-4 rounded-md mt-8 italic text-foreground border-l-4 border-lime-green">
            {data.quote?.[lang]}
            {data.quoteAuthor?.[lang] && (
              <span className="block text-right font-bold text-lime-green mt-2">
                — {data.quoteAuthor?.[lang]}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {data.tags?.[lang]?.length > 0 && (
          <div className="mt-8">
            <p className="font-bold text-lime-green mb-2 flex items-center gap-2 text-lg">
              Tags:
            </p>
            <div className="ml-2 grid lg:grid-cols-2 gap-y-3 gap-x-6">
              {data.tags[lang].map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-foreground text-md font-normal"
                >
                  <LucideCircleCheckBig className="text-yellow h-5 w-5 flex-shrink-0" />
                  <span className="text-foreground/80 leading-snug">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Points */}
        {data.keyPoints?.[lang]?.length > 0 && (
          <div className="mt-6">
            <p className="font-bold text-lime-green mb-2 flex items-center gap-2 text-lg">
              Key Points:
            </p>
            <div className="ml-2 grid lg:grid-cols-2 gap-y-4 gap-x-8">
              {data.keyPoints[lang].map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-foreground text-md font-normal"
                >
                  <LucideCircleCheckBig className="text-yellow h-5 w-5 mt-1 flex-shrink-0" />
                  <span className="text-foreground/80 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Image Grid */}
      {gridImages.length > 0 && (
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {gridImages.map((img, idx) => (
            <div key={idx} className="w-full h-40 rounded-lg overflow-hidden relative">
              <Image src={img} alt={`Campaign image ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      {showButton && (
        <div className="mt-12 flex flex-row gap-4 lg:gap-6 w-fit">
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
            onClick={onSubmit}
            bgColor="bg-lime-green"
            hoverBg="before:bg-green"
            icon=""
          >
            {createMutation?.isPending || updateMutation?.isPending ? (
              <ButtonLoader />
            ) : (
              <>{lang === "hi" ? "सबमिट" : "Submit"}</>
            )}
          </Button>
        </div>
      )}
    </MotionDiv>
  );
};

export default BlogPreview;
