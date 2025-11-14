import React from 'react'
import FAQSection from './FAQSection'
import { bannerBg } from '@/public/assets'
import BecomeVolunteer from '../Volunteer/BecomeVolunteer'
import PageBanner from '@/src/helper/PageBanner'
import VolunteerTeam from '../Volunteer/VolunteerTeam'

const FAQ = () => {
  return (
    <div >
      <PageBanner
        bgImage={bannerBg}
        tagline="Start Donating Poor People"
        title="Frequently Asked Questions"
        smallIcon="mdi:hand-heart"
        decoIcon="mdi:ribbon"
        decoPosition="absolute bottom-10 left-1"
      />
      <FAQSection />
      <BecomeVolunteer />
      <VolunteerTeam />
    </div>
  )
}

export default FAQ
