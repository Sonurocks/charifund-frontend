
'use client'
import { FaLanguage } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../web/LanguageSwitcher";

const LanguageSetting: React.FC = () => {
  const{t}=useTranslation();
  return (
    <div className="flex flex-col lg:flex-row w-full items-start">
      <div className="flex items-center gap-4 w-full">
        <div className="w-12 h-12 bg-primaryColor/10 text-primaryColor rounded-full flex items-center justify-center">
          <FaLanguage size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{t("Language")}</h3>
          <p className="text-gray-500 text-sm mt-1">
            {t("Change the display language.")}
          </p>
        </div>
      </div>
      <div className="mt-4 pl-16">
        <LanguageSwitcher rounded="rounded-lg" paddingx="px-2" paddingy="py-2"/>
      </div>
    </div>
  );
};
export default LanguageSetting;
