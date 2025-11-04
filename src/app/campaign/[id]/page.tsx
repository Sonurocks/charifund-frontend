"use client";
import { bannerBg } from "@/public/assets";
import CampaignDetails from "@/src/components/Web/Campaign/CampaignDetails";
import PageBanner from "@/src/helper/PageBanner";

const CampaignPage = () => {
   return (
      <>
         <PageBanner bgImage={bannerBg} title="Cause Details" />
         <CampaignDetails />
      </>
   )

};

export default CampaignPage;







