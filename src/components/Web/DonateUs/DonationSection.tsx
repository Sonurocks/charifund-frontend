"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { posterTwo } from "@/public/assets";
import Donation from "./Donation";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { useTranslation } from "react-i18next";
import { DonationSectionProps } from "@/src/types";
import ComponentLabel from "../../UI/web/ComponentLabel";

const DonationSection = ({data,isError,isLoading}:DonationSectionProps) => {
  const { t } = useTranslation();
  
  if(isLoading){
   return <CustomLoader/>
  }
  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow border border-gray-100 my-4">
        <h3 className="text-xl font-bold text-red mb-2">{t("Campaign Not Found")}</h3>
        <p className="text-gray-green mb-6 text-sm">
          {t("The requested campaign could not be found or is no longer active.")}
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/donate-us";
          }}
          className="inline-block px-6 py-2.5 bg-dark-green text-white rounded-full font-bold text-sm hover:bg-yellow hover:text-foreground transition-colors cursor-pointer"
        >
          {t("Make a General Donation")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-md xl:rounded-2xl">
      <div className="relative w-full h-[350px] md:h-[450px] bg-white rounded-xl xl:rounded-4xl overflow-hidden">
        <Image
          src={data?.images?.[0] || posterTwo.src}
          alt="Hero Cause"
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative top-[-52px] left-1/2 transform -translate-x-1/2 bg-white rounded-2xl w-[95%] md:w-[90%] px-4 xl:px-8 py-16 shadow z-20"
      >
        {data ? (
          <div className="mb-4">
            <ComponentLabel text={`${t("Campaign")}: ${data.title}`} isVisible={true} />
          </div>
        ) : (
          <div className="mb-4">
            <ComponentLabel text={t("Together, We Can Make a Difference")} isVisible={true} />
          </div>
        )}
        <h2 className="text-2xl md:text-4xl font-bold mb-6">
          {data?.title || t("Donate Today, Make a Difference")}
        </h2>
        <p className="text-gray-green my-4">
          {data?.description ||
            t(
              "Your support can help us provide education, food and nutrition, healthcare, skill development, and other essential support to children, women, and underprivileged communities."
            )}
        </p>
        <Donation
          campaignId={data?.id || (data as any)?.campaign?.id || (data as any)?._id || ""}
          campaignTitle={data?.title || (data as any)?.campaign?.title || ""}
        />
      </motion.div>
    </div>
  );
};

export default DonationSection;
