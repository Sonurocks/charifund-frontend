


"use client";

import React, { useState } from "react";
import { useParams} from "next/navigation";
import CampaignInfo from "./CampaignInfo";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { heartLogoIcon, overView } from "@/public/assets";
import { useFetchAllCampaigns, useFetchSingleCampaign } from "@/src/hooks/web/useCampaigns";
import Sidebar from "../../UI/web/sideBar";
import DonationCard from "../../UI/web/sideBar/DonationCard";


const CampaignDetails: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return <p>No campaign ID provided.</p>;

  const { data, isLoading, isError } = useFetchSingleCampaign(id);

  const [page] = useState(1);
  const { data: allCampaigns, isLoading: allCampaignsLoading } = useFetchAllCampaigns(page, 10);

  if(allCampaignsLoading||isLoading) return <div className="flex items-center justify-center h-full"><CustomLoader/></div>

    return (
    <section className="bg-white py-16  text-gray-green flex justify-center items-center w-full">
      <div className="max-w-7xl xl:max-w-[1440px] xl:px-18 xl:py-18 px-2 py-10 md:px-18 md:py-15 ">
        <div className=" grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left/Main content */}
          <div className="xl:col-span-2 relative">
            {isLoading || allCampaignsLoading ? (
              <div className="flex items-center justify-center h-full">
                <CustomLoader />
              </div>
            ) : isError ? (
              <div className="text-center flex items-center justify-center text-red">
                Failed to fetch campaign details.
              </div>
            ) : data ? (
              <CampaignInfo
                data={data}
                allCampaigns={allCampaigns?.campaigns || []}
                id={id}
              />
            ) : (
              <p>No campaign found.</p>
            )}
          </div>
          {/* Sidebar */}
          <div className="w-full  space-y-6 lg:space-y-10">
            <Sidebar pathName="campaigns" as="Recent Post" />
            <div className="xl:ml-8">
              <DonationCard
                icon={heartLogoIcon.src}
                backgroundImage={overView.src}
                subtitle="Small Donations Bigger Impact"
                title="Education Health For Every Child"
                buttonText="Get A Quote"
                onButtonClick={() => console.log("Button Clicked!")}
                onCardClick={() => { '' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignDetails;
