"use client";

import React from "react";
import Banner from "@/src/helper/PageBanner";
import { ourteambanner, termsAndConditions } from "@/public/assets";
import PrivacyPolicyPage from "@/src/components/Primary/PrivacyPolicy";

const PrivacyPolicy = () => {
  return (
    <div>
      <Banner bgImage={termsAndConditions} title="Privacy Policy" />
      <PrivacyPolicyPage />
    </div>
  );
};

export default PrivacyPolicy;
