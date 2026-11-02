"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const PartnersCompanies = dynamic(() => import("./PartnersCompanies"));
const HelpAndDonate = dynamic(() => import("./HelpAndDonate"));
const BecomeVolunteer = dynamic(() => import("../Volunteer/BecomeVolunteer"));
const Community = dynamic(() => import("./Community"));
const FeedbackForm = dynamic(() => import("../FeedbackForm"));
const DonateDifferentWay = dynamic(() => import("./DonateDifferentWay"));
const LatestNewsArticle = dynamic(() => import("./LatestNewsArticle"));
const ScrollToTop = dynamic(() => import("../../../helper/ScrollToTop"));
const VolunteerTeam = dynamic(() => import("../Volunteer/VolunteerTeam"));
const ValueableCustomer = dynamic(() => import("../Volunteer/ValueableCustomer"));
const HelpingEachOther = dynamic(() => import("./HelpingEachOther"));
import HeroStaticSlider from "./Hero";
import CharityWithDifference from "./Charity_with_Difference/CharityWithDiffrence";
import { useHomeOverview } from "@/src/hooks/web/useHomeOverview";

const Home = () => {
  // Bundled single-request data loader (primes TanStack cache for all homepage sections)
  useHomeOverview();

  const [hasFeedback, setHasFeedback] = useState<boolean | null>(true);
  return (
    <div>
      <HeroStaticSlider />
      <PartnersCompanies />
      <CharityWithDifference />
      <HelpingEachOther />
      <HelpAndDonate />
      <BecomeVolunteer />
      <VolunteerTeam />
      <Community hasFeedback={hasFeedback} />
      <div className="mt-8 md:mt-0"></div>
      {hasFeedback ? (
        <ValueableCustomer />
      ) : (
        <div className="mt-[100px] md:mt-[112px] " />
      )}
      <FeedbackForm />
      <DonateDifferentWay />
      <LatestNewsArticle />
      <ScrollToTop />
    </div>
  );
};

export default Home;
