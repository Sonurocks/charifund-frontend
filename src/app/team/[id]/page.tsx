"use client";

import TeamMemberDetails from "@/src/components/Web/Team/TeamMemberDetails";
import PageBanner from "@/src/helper/PageBanner";
import { useParams } from "next/navigation";


const Page = () => {
  const { id } = useParams();
  return (
    <div>
      <PageBanner bgImage="/assets/banner-bg.webp" title="Team Details" />
      <TeamMemberDetails id={id as string}  />
    </div>
  );
};

export default Page;
