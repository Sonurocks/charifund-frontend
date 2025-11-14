import React from "react";
import { useTranslation } from "react-i18next";

interface ComponentTitleProps {
  preText: string;
  highlightText: string;
  postText?: string;
  className?: string;
  highlightClassName?: string;
}

const ComponentTitle: React.FC<ComponentTitleProps> = ({
  preText,
  highlightText,
  postText = "",
  className = "",
  highlightClassName = "text-yellow",
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mb-3 md:mb-3 lg:mb-3 md:pr-15 lg:pr-10 xs:pr-1 xl:pr-0 ${className}`}>
      <h2 className="text-[24px] font-nunito md:text-4xl lg:text-4xl xl:text-[56px] md:tracking-normal lg:tracking-tight font-extrabold text-dark-green leading-tight tracking opacity-0 anim-fade-in-up">
        {t(preText)}{" "}
        <span className={highlightClassName}>{t(highlightText)} {" "}</span>
        {t(postText)}
      </h2>
    </div>
  );
};

export default ComponentTitle;
