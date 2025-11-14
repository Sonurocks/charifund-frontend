import { LanguageToggleProps } from "@/src/types/admin";
import React from "react";


const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onChange }) => {
  return (
    <div className="flex justify-start text-[13px] mb-4">
      <button
        type="button"
        className={`cursor-pointer px-2 py-1 ${
          language === "en" ? "bg-lime-green text-white" : "bg-gray-200 text-gray-800"
        } rounded-l`}
        onClick={() => onChange("en")}
        disabled={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        className={`cursor-pointer px-2 py-1 ${
          language === "hi" ? "bg-lime-green text-white" : "bg-gray-200 text-gray-800"
        } rounded-r`}
        onClick={() => onChange("hi")}
        disabled={language === "hi"}
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageToggle;
