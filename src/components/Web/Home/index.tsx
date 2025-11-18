'use client'

import React, { useState } from 'react'
import PartnersCompanies from './PartnersCompanies';
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
import HeroStaticSlider from './Hero';
import CharityWithDifference from './Charity_with_Difference/CharityWithDiffrence';

const Home = () => {
      const [hasFeedback, setHasFeedback]=useState<boolean|null>(true);
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
        <ValueableCustomer/>
      ) : (
        <div className="mt-[100px] md:mt-[112px] " />
      )}
      <FeedbackForm />
      <DonateDifferentWay />
      <LatestNewsArticle />
      <ScrollToTop />
    </div>
  )
}

export default Home
