'use client'
import React from 'react'
import ContactUs from './ContactUs'

import PageBanner from "@/src/helper/PageBanner";

const Contact = () => {
    return (
        <div>
            <PageBanner pageName="Contact Us" tagline="Be a Part of Positive Change" title="Contact Us" />
            <ContactUs />
        </div>
    )
}

export default Contact
