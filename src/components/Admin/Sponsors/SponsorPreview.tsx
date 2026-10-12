"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaTag, FaMapMarkerAlt } from "react-icons/fa";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";

interface SponsorPreviewProps {
  data: any;
  onSubmit?: () => void;
  onBack?: () => void;
  mode?: "add" | "edit" | "view" | "preview-edit";
  showButton?: boolean;
  createMutation?: any;
  updateMutation?: any;
}

const SponsorPreview = ({
  data,
  onSubmit,
  onBack,
  showButton = true,
  createMutation,
  updateMutation,
}: SponsorPreviewProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, toggleLanguage } = useLanguageToggle();
  const lang = language;

  const getLangText = (field: any): string => {
    if (field && typeof field === "object" && lang in field) {
      return field[lang] ?? "";
    }
    return typeof field === "string" ? field : "";
  };

  useEffect(() => {
    const rawLogo = data?.logo || data?.image;
    if (!rawLogo) return;

    if (typeof rawLogo === "string") {
      setLogoPreview(rawLogo);
    } else if (rawLogo instanceof File || rawLogo instanceof Blob) {
      const url = URL.createObjectURL(rawLogo);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [data?.logo, data?.image]);

  const handleSubmit = async () => {
    if (!onSubmit) return;
    try {
      setIsSubmitting(true);
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const name = getLangText(data?.name);
  const category = getLangText(data?.category);
  const location = getLangText(data?.location);
  const shortDescription = getLangText(data?.shortDescription);
  const description = getLangText(data?.description);

  return (
    <motion.div
      className="bg-white py-4 max-w-2xl mx-auto font-nunito text-black"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex justify-start">
        <LanguageToggle language={language} onChange={toggleLanguage} />
      </div>

      {/* Logo container */}
      <div className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center p-6 mb-6">
        {logoPreview ? (
          <Image
            src={logoPreview}
            alt={name || "Sponsor Logo"}
            width={220}
            height={100}
            className="object-contain max-h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm">No logo uploaded</span>
        )}
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {category && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-green/10 text-dark-green">
            <FaTag className="w-3 h-3 text-green" />
            {category}
          </span>
        )}
        {location && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            <FaMapMarkerAlt className="w-3 h-3 text-green" />
            {location}
          </span>
        )}
      </div>

      {/* Name */}
      <h2 className="text-2xl font-extrabold text-dark-green mb-3">
        {name || "Untitled Sponsor"}
      </h2>

      {/* Website Link */}
      {data?.website && (
        <div className="mb-6">
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-green hover:text-dark-green font-semibold underline"
          >
            <span>{data.website}</span>
            <FaExternalLinkAlt className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Short Description */}
      {shortDescription && (
        <div className="p-4 bg-gray-50 border-l-4 border-yellow rounded-r-lg mb-6">
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            {shortDescription}
          </p>
        </div>
      )}

      {/* Full Description */}
      {description && (
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed mb-8">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold">
            {lang === "hi" ? "पूर्ण विवरण" : "Detailed Description"}
          </h4>
          {description.split("\n").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Action Buttons for Preview Mode */}
      {showButton && (
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
          {onBack && (
            <Button
              bgColor="bg-gray-400"
              rounded="rounded-lg"
              hoverBg="before:bg-gray-500"
              onClick={onBack}
              icon=""
            >
              {lang === "hi" ? "वापस जाएं" : "Back to Edit"}
            </Button>
          )}
          <Button
            rounded="rounded-lg"
            onClick={handleSubmit}
            bgColor="bg-lime-green"
            hoverBg="before:bg-green"
            icon=""
            disabled={isSubmitting || createMutation?.isPending || updateMutation?.isPending}
          >
            {isSubmitting || createMutation?.isPending || updateMutation?.isPending ? (
              <ButtonLoader />
            ) : (
              <>{lang === "hi" ? "सहेजें और सबमिट करें" : "Save & Submit"}</>
            )}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default SponsorPreview;
