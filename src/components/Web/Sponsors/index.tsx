import React from 'react'
import PageBanner from '@/src/helper/PageBanner'
import SponsorsList from './SponsorsList'

const Sponsors = () => {
  return (
    <div>
      <PageBanner pageName="Sponsors"
        tagline="Together for a Better Society"
        title="Our Sponsors"
        smallIcon="mdi:handshake-outline"
      />
      <SponsorsList />
    </div>
  )
}

export default Sponsors
