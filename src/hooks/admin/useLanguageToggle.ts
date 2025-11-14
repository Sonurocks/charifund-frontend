import { useState } from "react";

export const useLanguageToggle = () => {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const toggleLanguage = (lang: "en" | "hi") => {
    setLanguage(lang);
  };

  return { language, toggleLanguage };
};
