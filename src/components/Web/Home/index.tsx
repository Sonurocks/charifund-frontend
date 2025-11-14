'use client'

import React, { useState } from 'react'
import PartnersCompanies from './PartnersCompanies';
import HeroStaticSlider from './Hero';
import CharityWithDifference from './Charity_with_Difference/CharityWithDiffrence';
import HelpAndDonate from './HelpAndDonate';
import BecomeVolunteer from '../Volunteer/BecomeVolunteer';
import Community from './Community';
import FeedbackForm from '../FeedbackForm';
import DonateDifferentWay from './DonateDifferentWay';
import LatestNewsArticle from './LatestNewsArticle';
import ScrollToTop from '../../../helper/ScrollToTop';
import VolunteerTeam from '../Volunteer/VolunteerTeam';
import ValueableCustomer from '../Volunteer/ValueableCustomer';
import HelpingEachOther from './HelpingEachOther';

const Home = () => {
      const [hasFeedback,setHasFeedback]=useState<boolean|null>(true);
  return (
    <div>
      <HeroStaticSlider />
      <PartnersCompanies />
      <CharityWithDifference />
      <HelpingEachOther />
      <HelpAndDonate />
      <BecomeVolunteer />
      <VolunteerTeam />
      <Community hasfeedback={hasFeedback} />
      <div className="mt-8 md:mt-0"></div>
      {hasFeedback ? (
        <ValueableCustomer/>
      ) : (
        <div className="mt-[100px] md:mt-[112px] " />
      )}
      <FeedbackForm />
      {/* <ChildOldCare  /> */}
      <DonateDifferentWay />
      <LatestNewsArticle />
      <ScrollToTop />
    </div>
  )
}

export default Home
