import DonorTable from "@/src/components/Admin/Campaign/Donors/DonorTable";
import Breadcrumb from "@/src/components/Admin/Breadcrumb";
import React from "react";

export const metadata = {
  title: "charifund | Campaign Donors",
};

export default function DonorsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Breadcrumb lable="Campaign Donors" />
      <section className="mt-5">
        <DonorTable campaignId={params.id} />
      </section>
    </div>
  );
}
