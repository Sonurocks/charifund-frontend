import React from 'react'
import HelpingEachOther from '../Home/HelpingEachOther'
import ChildrenNeed from './ChildrenNeed'
import VolunteerTeam from '../Volunteer/VolunteerTeam'
import FAQSection from '../FAQ/FAQSection'
import ValueableCustomer from '../Volunteer/ValueableCustomer'
import SendMsg from './SendMsg'
import ScrollImgSection from './ScrollImgSection'
import { aboutus } from '@/public/assets'
import DonateDifferentWay from '../Home/DonateDifferentWay'
import PageBanner from '@/src/helper/PageBanner'


const About = () => {
  
  return (
    <div>
      <PageBanner bgImage={aboutus} title="About us" />
      <HelpingEachOther />
      <ChildrenNeed />
      <VolunteerTeam bg=''/>
      <FAQSection />
      <ValueableCustomer />
      <SendMsg />
      <DonateDifferentWay />
      <ScrollImgSection />
    </div>
  )
}

export default About
