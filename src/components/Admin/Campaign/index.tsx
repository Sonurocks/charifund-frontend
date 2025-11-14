


"use client";

import React from "react";
import dynamic from "next/dynamic";
import Breadcrumb from "../Breadcrumb";

// Dynamically import CampaignTable (no SSR for client components)
const CampaignTable = dynamic(() => import("./CampaignTable"), {
  ssr: false,
  loading: () => <p className="text-center py-10">Loading campaigns...</p>,
});

const Campaign = () => {
  return (
    <div>
      <Breadcrumb lable="Campaign" />
      <section className="mt-5">
        <CampaignTable />
      </section>
    </div>
  );
};

export default Campaign;
