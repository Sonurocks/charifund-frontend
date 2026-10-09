'use client'
import React from 'react'
import { ourcausebanner } from '@/public/assets'
import { useTranslation } from 'react-i18next';
import SendMsg from '../About/SendMsg';
import ChildrenNeed from '../About/ChildrenNeed';
import HelpAndDonate from '../Home/HelpAndDonate';
import CampaignGrid from './CampaignGrid';
import PageBanner from '@/src/helper/PageBanner';

const Campaign = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PageBanner pageName="Campaign"
        bgImage={ourcausebanner}
        tagline="Together for a Better Society"
        title="Our Campaigns for Social Change"
        titleClassName="mx-auto max-w-[17ch] sm:max-w-[18ch] leading-tight xl:leading-[1.1]"
        smallIcon="mdi:hand-heart"
        decoIcon="mdi:ribbon"
        decoPosition="absolute bottom-10 left-10"
      />
      <CampaignGrid />
      <ChildrenNeed />
      {/* <HelpAndDonate /> */}
      <SendMsg />
    </div>
  )
}

export default Campaign
