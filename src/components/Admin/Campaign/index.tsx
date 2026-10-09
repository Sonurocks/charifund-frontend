"use client";

import React from "react";
import Breadcrumb from "../Breadcrumb";
import CampaignTable from "./CampaignTable";

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
