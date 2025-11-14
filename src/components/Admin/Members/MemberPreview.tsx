"use client";

import React, { useEffect, useState, useMemo, JSX } from "react";
import { motion } from "framer-motion";
import { LucideCircleCheckBig } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import { useTranslation } from "react-i18next";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { MemberPreviewProps } from "@/src/types/admin";

const MemberPreview = ({ data, onSubmit, onBack, mode,showButton=true,createMutation,updateMutation }: MemberPreviewProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { language, toggleLanguage } = useLanguageToggle();
  const lang = language;
   console.log(data) 
  // Get localized string
  const getLangText = (field: any): string => {
    if (field && typeof field === "object" && lang in field) {
      return field[lang] ?? "";
    }
    return typeof field === "string" ? field : "";
  };

  // Get localized array
  const getLangArray = (field: any): string[] => {
    if (Array.isArray(field)) return field;
    if (field && typeof field === "object" && lang in field) return field[lang] ?? [];
    return [];
  };

  const socialIconClass =
    "text-white bg-blue-50 hover:bg-yellow rounded-full p-2 size-10 hover:scale-110 transition";

  const socialLinks = useMemo(
    () =>
      [
        { url: data?.facebookUrl||'', icon: <FaFacebook className={socialIconClass} /> },
        { url: data?.twitterUrl||'', icon: <FaTwitter className={socialIconClass} /> },
        { url: data?.instagramUrl||'', icon: <FaInstagram className={socialIconClass} /> },
        { url: data?.linkedInUrl||'', icon: <FaLinkedin className={socialIconClass} /> },
      ].filter((link): link is { url: string; icon: JSX.Element } => !!link.url),
    [data?.facebookUrl, data?.twitterUrl, data?.instagramUrl, data?.linkedInUrl]
  );

  useEffect(() => {
    if (!data.image) return;

    let preview: string;

    if (typeof data.image === "string") {
      preview = data.image;
    } else if (data.image instanceof File || data.image instanceof Blob) {
      preview = URL.createObjectURL(data.image);
    } else {
      return;
    }

    setImagePreview(preview);

    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [data.image]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const {t} = useTranslation();

  return (
    <motion.div
      className="bg-white lg:px-4 py-8 max-w-5xl mx-auto font-sans text-black"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* 🔀 Language Toggle */}
      <div className="mb-6 flex justify-start">
        <LanguageToggle language={language} onChange={toggleLanguage} />
      </div>

      {/* Member Image */}
      {imagePreview && (
        <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-yellow shadow-md">
          <img src={imagePreview} alt={data?.name?.[lang]} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Name & Position */}
      <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-center text-foreground">
        {data?.name?.[lang]}
      </h2>
      <p className="text-lg text-center text-foreground/70 mb-6">{data?.position?.[lang]}</p>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-2 text-foreground">
        {data?.title?.[lang] || ""}
      </h3>

      {/* Description & About */}
      <div className="space-y-4 text-foreground/70 font-[400] text-md leading-relaxed mb-8">
        <p>{data?.description?.[lang]}</p>
        {data?.about && <p>{data?.about?.[lang]}</p>}
      </div>

      {/* Key Points */}
      <div className="mt-4">
                <p className="font-bold text-lime-green mb-1 flex items-center gap-2">
                  Key Points:
                </p>
                <div className="ml-2 space-y-1 grid lg:grid-cols-2 gap-2">
                  {(data.keyPoints?.[lang] ?? []).map((point, idx) => (
                    <p key={idx} className="flex items-start gap-2 text-foreground">
                      <LucideCircleCheckBig className="text-yellow h-5 w-5" />
                      <span className="text-[16px]">{point}</span>
                    </p>
                  ))}
                </div>
              </div>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="mt-6">
          <p className="font-bold text-lime-green mb-2">{lang === "hi" ? "सोशल मीडिया" : "Social Links"}:</p>
          <div className="flex gap-4">
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noreferrer">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      {showButton&&(
      <div className="mt-12 flex justify-baseline gap-6 w-fit ">
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
          onClick={handleSubmit}
          bgColor="bg-lime-green"
          hoverBg="before:bg-green"
          icon=""
          disabled={isSubmitting}
        >
          {isSubmitting||createMutation?.isPending || updateMutation?.isPending ? (
                      <ButtonLoader />
                    ) : <>{lang === "hi" ? "सबमिट" : "Submit"}</>}
                  </Button>
      </div>
      )}
    </motion.div>
  );
};

export default MemberPreview;
