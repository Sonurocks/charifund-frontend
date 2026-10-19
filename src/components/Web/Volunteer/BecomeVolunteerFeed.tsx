"use client";

import { Icon } from "@iconify/react";
import { VolunteerFeatures, VolunteerPage, VolunteerProgress } from "@/src/static-resource/web";
import { useTranslation } from "react-i18next";

const BecomeVolunteerFeed = () => {
  const { t } = useTranslation();

  return (
    <section className="font-nunito">
      {/* Header */}
      <div className="mb-5 xl:mb-8 ">
        <p className="text-green font-caveat  flex items-center justify-baseline gap-2 text-2xl font-bold">
          <Icon icon="mdi:hand-heart" className="" />
          {t(VolunteerPage.subtitle)}
        </p>
        <h2 className="font-nunito text-xl  xl:text-[50px] font-extrabold text-foreground mt-2">
          {t(VolunteerPage.title)}
        </h2>
        <p className="mt-2 text-gray-500 text-[10px] xl:text-[15px] leading-4 xl:leading-8 ">
          {t(VolunteerPage.description)}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Volunteer Eligibility */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">{t("Volunteer Eligibility")}</h3>
          <ul className="space-y-3">
            <li className="flex gap-2 text-gray-500 text-[15px]">
              <span className="font-bold text-green">{t("Age")}:</span> {t("18 years and above")}
            </li>
            <li className="flex gap-2 text-gray-500 text-[15px]">
              <span className="font-bold text-green">{t("Commitment")}:</span> {t("Willingness to volunteer regularly and responsibly")}
            </li>
            <li className="flex gap-2 text-gray-500 text-[15px]">
              <span className="font-bold text-green">{t("Skills")}:</span> {t("Any useful skill, professional expertise or willingness to learn")}
            </li>
            <li className="flex gap-2 text-gray-500 text-[15px]">
              <span className="font-bold text-green">{t("Teamwork")}:</span> {t("Ability to work respectfully with our team and community")}
            </li>
            <li className="flex gap-2 text-gray-500 text-[15px]">
              <span className="font-bold text-green">{t("Purpose")}:</span> {t("Commitment to social welfare and community development")}
            </li>
          </ul>
        </div>

        {/* What You Can Contribute */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4">{t("What You Can Contribute")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-yellow/10 p-4 rounded-xl border border-yellow/20">
              <h4 className="font-bold text-foreground mb-1">{t("Education & Child Welfare")}</h4>
              <p className="text-gray-500 text-sm">{t("Support educational activities and child-focused initiatives.")}</p>
            </div>
            <div className="bg-green/10 p-4 rounded-xl border border-green/20">
              <h4 className="font-bold text-foreground mb-1">{t("Women Empowerment")}</h4>
              <p className="text-gray-500 text-sm">{t("Support skill development and livelihood programs for women and girls.")}</p>
            </div>
            <div className="bg-yellow/10 p-4 rounded-xl border border-yellow/20">
              <h4 className="font-bold text-foreground mb-1">{t("Health & Blood Donation")}</h4>
              <p className="text-gray-500 text-sm">{t("Assist in health awareness and blood donation initiatives.")}</p>
            </div>
            <div className="bg-green/10 p-4 rounded-xl border border-green/20">
              <h4 className="font-bold text-foreground mb-1">{t("Environment")}</h4>
              <p className="text-gray-500 text-sm">{t("Participate in cleanliness, plantation and environmental awareness activities.")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6 xl:mb-10 mt-5 xl:mt-10">
        {VolunteerProgress.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon icon="mdi:hand-heart" className="text-yellow text-xl" />
            <div className="text-[16px] font-bold text-foreground">
              <span>{t(item.label)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-3 text-[15px] font-semibold">
        {VolunteerFeatures.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon icon="prime:check-circle" className="text-green text-xl" />
            <span className="">{t(feature.text)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BecomeVolunteerFeed;