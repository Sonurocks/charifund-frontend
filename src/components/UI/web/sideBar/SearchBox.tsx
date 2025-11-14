"use client";
import FadeInUp from "@/src/animations/FadeInUp";
import { SearchBoxProps } from "@/src/types";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const SearchBox = ({bgColor,searchText,setSearchtext}:SearchBoxProps) => {
  const { t } = useTranslation();
  return(
  <FadeInUp
    className={`${bgColor} p-6 rounded-2xl shadow-md mb-6`}>
    <h3 className="font-bold text-xl mb-4">{t("Search Here")}</h3>
    <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3">
      <input
        type="text"
        placeholder={t("Search Here...")}
        value={searchText}
        onChange={(e)=>setSearchtext(e.target.value)}
        className="flex-1 outline-none bg-transparent text-foreground/60"
      />
      <Icon icon="mdi:magnify" className="text-foreground/60 text-xl" />
    </div>
  </FadeInUp>
)};

export default SearchBox;
