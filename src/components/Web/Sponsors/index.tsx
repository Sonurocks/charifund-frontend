import React from 'react'
import { ourcausebanner } from '@/public/assets'
import PageBanner from '@/src/helper/PageBanner'
import SponsorsList from './SponsorsList'

const Sponsors = () => {
  return (
    <div>
      <PageBanner pageName="Sponsors"
        bgImage={ourcausebanner}
        tagline="Together for a Better Society"
        title="Our Sponsors"
        smallIcon="mdi:handshake-outline"
      />
      <SponsorsList />
    </div>
  )
}

export default Sponsors
