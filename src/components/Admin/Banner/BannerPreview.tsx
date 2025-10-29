"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { BannerPreviewProps } from "@/src/types/admin";

//  Lazy-load heavy components
const LanguageToggle = dynamic(() => import("../../UI/admin/LanguageToggle"), {
  loading: () => <p className="text-gray-400 animate-pulse">Loading language toggle...</p>,
});

const Button = dynamic(() => import("../../UI/web/Buttons/Button"), {
  loading: () => <p className="text-gray-400 animate-pulse">Loading button...</p>,
});

const ButtonLoader = dynamic(() => import("../../UI/web/Loader/ButtonLoader"), {
  loading: () => <span className="text-gray-400 animate-pulse">Loading...</span>,
});

const BannerPreview: React.FC<BannerPreviewProps> = ({
  data,
  onSubmit,
  onBack,
  mode,
  showButtons = true,
  createMutation,
  updateMutation,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { language, toggleLanguage } = useLanguageToggle();

  useEffect(() => {
    if (!data.image) return;

    if (data.image instanceof File || data.image instanceof Blob) {
      const objectUrl = URL.createObjectURL(data.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof data.image === "string") {
      setImagePreview(data.image);
    }
  }, [data.image]);

  const lang = language;

  return (
    <div className="space-y-4">
      {/* Language Toggle */}
      <LanguageToggle language={language} onChange={toggleLanguage} />

      {/* Image Preview */}
      {imagePreview ? (
        <div className="relative w-full h-64 sm:h-80 rounded shadow-md overflow-hidden">
          <Image
            src={imagePreview}
            alt={data.title?.[lang] || "Banner Preview"}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500">No Image Provided</span>
        </div>
      )}

      {/* Banner Info */}
      <div className="text-md space-y-2">
        <h2 className="text-2xl font-bold text-dark-green">{data.title?.[lang]}</h2>
        <p>
          <strong className="text-xl text-dark-green">Priority:</strong>{" "}
          {data.priority || "Not set"}
        </p>
        <p>
          <strong className="text-xl text-dark-green">Subtitle:</strong>{" "}
          {data.subtitle?.[lang]}
        </p>
      </div>

      {/* Buttons */}
      {showButtons && (
        <div className="mt-12 flex gap-6 justify-start w-fit">
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
            ) : (
              <>{lang === "hi" ? "सबमिट" : "Submit"}</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BannerPreview;
