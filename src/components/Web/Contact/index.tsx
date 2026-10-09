'use client'
import React from 'react'
import ContactUs from './ContactUs'

import PageBanner from "@/src/helper/PageBanner";
import { contactbanner } from '@/public/assets'

const Contact = () => {
    return (
        <div>
            <PageBanner pageName="Contact Us" bgImage={contactbanner} tagline="Be a Part of Positive Change" title="Contact Us" />
            <ContactUs />
        </div>
    )
}

export default Contact
