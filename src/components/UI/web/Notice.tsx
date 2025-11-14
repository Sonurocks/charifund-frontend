
'use client'
import { NoticeProps } from "@/src/types";
import React from "react";
import { useTranslation } from "react-i18next";

const Notice: React.FC<NoticeProps> = ({
  title,
  message,
  icon = "⚠️",
  wrapperClassName = "",
  iconWrapperClassName = "",
  iconClassName = "",
  titleClassName = "",
  messageClassName = "",
}) => {
  const { t } = useTranslation();

  // Set default title if not provided
  const displayTitle = title || t("Notice");

  return (
    <div
      className={`xl:px-15 max-w-[35rem] flex items-center relative p-3 border border-gray-200 bg-yellow/8 rounded xl:rounded-full shadow-sm ${wrapperClassName}`}
    >
      {/* Icon section (only visible on xl) */}
      <div
        className={`h-full w-[4px] absolute top-0 left-10 hidden xl:flex justify-center items-center bg-dark-green ${iconWrapperClassName}`}
      >
        <span className={`text-lg text-yellow ${iconClassName}`}>{icon}</span>
      </div>

      {/* Text */}
      <p className={`text-[15px] text-gray-green ${messageClassName}`}>
        <strong className={`font-semibold text-foreground ${titleClassName}`}>
          {displayTitle}:
        </strong>{" "}
        {t(`${message}`)}
      </p>
    </div>
  );
};

export default Notice;
