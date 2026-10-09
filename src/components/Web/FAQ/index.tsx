import React from 'react'
import FAQSection from './FAQSection'
import { bannerBg } from '@/public/assets'
import BecomeVolunteer from '../Volunteer/BecomeVolunteer'
import PageBanner from '@/src/helper/PageBanner'
import VolunteerTeam from '../Volunteer/VolunteerTeam'

const FAQ = () => {
  return (
    <div >
      <PageBanner pageName="FAQ"
        bgImage={bannerBg}
        tagline="Empowering Lives, Building a Better Society"
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
