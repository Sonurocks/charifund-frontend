"use client";
import { donateusbanner, heartLogoIcon, overView } from "@/public/assets";
import { useState } from "react";
import DonationSection from "./DonationSection";
import { useFetchSingleCampaign } from "@/src/hooks/web/useCampaigns";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import PageBanner from "@/src/helper/PageBanner";
import Sidebar from "../../UI/web/sideBar";
import DonationCard from "../../UI/web/sideBar/DonationCard";

const DonateUs = ({ id: propId }: { id?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // Determine campaign identifier: prefer route param [id], then searchParams (?campaignId or ?id)
  const campaignId = propId || searchParams?.get("campaignId") || searchParams?.get("id") || undefined;

  const {
    data: singleCampaign,
    isLoading: singleCampaignLoading,
    isError: singleCampaignError,
  } = useFetchSingleCampaign(campaignId!, { enabled: !!campaignId });

  const isLoading = campaignId ? singleCampaignLoading : false;
  const isError = campaignId ? singleCampaignError : false;
  // Never default to first campaign; only select a campaign if a valid campaign identifier was provided
  const campaign = campaignId ? singleCampaign || null : null;

  return (
    <section>
      <PageBanner pageName="Donate Us"
        bgImage={donateusbanner}
        tagline={t("Start Donating Poor People")}
        title={t("Donate Us")}
        smallIcon="mdi:hand-heart"
        decoIcon="mdi:ribbon"
        decoPosition="absolute bottom-10 left-10"
      />
      <section className="bg-white py-16 flex justify-center items-center w-full">
        <div className="w-11/12 xl:w-10/12">
          <div className=" grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2 relative">
              <DonationSection data={campaign} isLoading={isLoading} isError={isError} />

            </div>
            <div className="xl:col-span-1 space-y-8 clear-both ">
              <Sidebar pathName={'donate-us'} />
              <DonationCard
                icon={heartLogoIcon.src}
                backgroundImage={overView.src}
                subtitle={t("Small Donations Bigger Impact")}
                title={t("Education Health For Every Child")}
                buttonText={t("Get A Quote")}
                onCardClick={() => { '' }}
                onButtonClick={() => router.push("/contact")}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DonateUs;
