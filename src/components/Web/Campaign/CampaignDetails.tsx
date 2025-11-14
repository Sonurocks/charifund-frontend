"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import CampaignInfo from "./CampaignInfo";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { bannerBg, heartLogoIcon, overView } from "@/public/assets";
import {
  useFetchAllCampaigns,
  useFetchSingleCampaign,
} from "@/src/hooks/web/useCampaigns";
import Sidebar from "../../UI/web/sideBar";
import DonationCard from "../../UI/web/sideBar/DonationCard";
import PageBanner from "@/src/helper/PageBanner";

const CampaignDetails: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return (
      <>
        <PageBanner bgImage={bannerBg} title="Cause Details" />
        <div className="flex items-center justify-center h-[60vh] text-red font-semibold">
          No campaign Found.
        </div>
      </>
    );
  }

  // Fetch campaign data
  const { data, isLoading, isError } = useFetchSingleCampaign(id);
  const [page] = useState(1);
  const {
    data: allCampaigns,
    isLoading: allCampaignsLoading,
    isError: allCampaignsError,
  } = useFetchAllCampaigns(page, 10);

  const isContentLoading = isLoading || allCampaignsLoading;
  const isContentError = isError || allCampaignsError;

  return (
    <section>
      {/* ✅ Banner always rendered */}
      <PageBanner bgImage={bannerBg} title="Cause Details" />

      {/* ✅ The main content area */}
      <section className="bg-white py-16 text-gray-green flex justify-center items-start w-full">
        <div className="max-w-7xl xl:max-w-[1440px] xl:px-18 px-2 md:px-18 w-full">
          {isContentLoading ? (
            // ✅ Loader only inside content area
            <div className="flex items-center justify-center h-[400px]">
              <CustomLoader />
            </div>
          ) : isContentError ? (
            // ❌ Error only inside content
            <div className="flex items-center justify-center h-[400px] text-red text-lg font-semibold">
              Failed to load campaign details. Please try again later.
            </div>
          ) : data ? (
            // ✅ Show content if data exists
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left/Main content */}
              <div className="xl:col-span-2 relative">
                <CampaignInfo
                  data={data}
                  allCampaigns={allCampaigns?.campaigns || []}
                  id={id}
                />
              </div>

              {/* Sidebar */}
              <div className="w-full space-y-6 lg:space-y-10">
                <Sidebar pathName="campaigns" as="Recent Post" />
                <div className="xl:ml-8">
                  <DonationCard
                    icon={heartLogoIcon.src}
                    backgroundImage={overView.src}
                    subtitle="Small Donations Bigger Impact"
                    title="Education Health For Every Child"
                    buttonText="Get A Quote"
                    onButtonClick={() => console.log("Button Clicked!")}
                    onCardClick={() => {}}
                  />
                </div>
              </div>
            </div>
          ) : (
            // 🟡 No campaign found
            <div className="flex items-center justify-center h-[400px] text-gray-500">
              No campaign found.
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default CampaignDetails;
