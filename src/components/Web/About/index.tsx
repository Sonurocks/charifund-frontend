import React from 'react'
import HelpingEachOther from '../Home/HelpingEachOther'
import ChildrenNeed from './ChildrenNeed'
import VolunteerTeam from '../Volunteer/VolunteerTeam'
import FAQSection from '../FAQ/FAQSection'
import ValueableCustomer from '../Volunteer/ValueableCustomer'
import SendMsg from './SendMsg'
import { aboutus } from '@/public/assets'
import DonateDifferentWay from '../Home/DonateDifferentWay'
import PageBanner from '@/src/helper/PageBanner'


const About = () => {
  
  return (
    <div>
      <PageBanner pageName="About Us" 
        bgImage={aboutus} 
        title="About YUWA India" 
        tagline="Empowering Lives, Building a Better Society" 
      />
      <HelpingEachOther />
      {/* <ChildrenNeed /> */}
      <VolunteerTeam bg=''/>
      <FAQSection />
      <ValueableCustomer />
      <SendMsg />
      <DonateDifferentWay />
    </div>
  )
}

export default About
