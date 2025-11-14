"use client";
import { donateusbanner, heartLogoIcon, overView } from "@/public/assets";
import { faqData } from "@/src/staticResource";
import { useState } from "react";
import Gallery from "./Gallery";
import FadeInUp from "@/src/animations/FadeInUp";
import DonationSection from "./DonationSection";
import { useFetchAllCampaigns, useFetchSingleCampaign } from "@/src/hooks/web/useCampaigns";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import FAQAccordion from "../../UI/web/Accordians/FAQAccordion";
import PageBanner from "@/src/helper/PageBanner";
import Sidebar from "../../UI/web/sideBar";
import DonationCard from "../../UI/web/sideBar/DonationCard";
const page = 1;

const DonateUs = ({ id }: { id?: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const router = useRouter();
  const { t } = useTranslation();
  const {
    data: allCampaigns,
    isLoading: allCampaignsLoading,
    isError: allCampaignsError,
  } = useFetchAllCampaigns(page, 10);

  const {
    data: singleCampaign,
    isLoading: singleCampaignLoading,
    isError: singleCampaignError,
  } = useFetchSingleCampaign(id!, { enabled: !!id });

  const isLoading = id ? singleCampaignLoading : allCampaignsLoading;
  const isError = id ? singleCampaignError : allCampaignsError;
  const campaigns = id ? singleCampaign : allCampaigns?.campaigns?.[0];

  return (
    <section>
      <PageBanner
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
              <DonationSection data={campaigns} isLoading={isLoading} isError={isError} />
              <div className="col-span-2 space-y-6 ">
                <Gallery />
                <FadeInUp
                  className="space-y-6 "
                >
                  {faqData.map((item, index) => (
                    <FAQAccordion
                      key={index}
                      item={item}
                      isOpen={openIndex === index}
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                  ))}
                </FadeInUp>
              </div>
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
