"use client";

import React from "react";
// import Banner from "@/src/helper/PageBanner";
import { ourteambanner, termsAndConditions } from "@/public/assets";
import PrivacyPolicyPage from "@/src/components/Primary/PrivacyPolicy";
import PageBanner from "@/src/helper/PageBanner";

const PrivacyPolicy = () => {
  return (
    <div>
      <PageBanner bgImage={termsAndConditions} title="Privacy Policy" />
      <PrivacyPolicyPage />
    </div>
  );
};

export default PrivacyPolicy;
