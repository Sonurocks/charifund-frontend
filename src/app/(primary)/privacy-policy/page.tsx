"use client";

import React from "react";
import {  termsAndConditions } from "@/public/assets";
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
