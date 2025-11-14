'use client'
import React from 'react'
import ContactUs from './ContactUs'

import PageBanner from "@/src/helper/PageBanner";
import { contactbanner } from '@/public/assets'

const Contact = () => {
    return (
        <div>
            <PageBanner bgImage={contactbanner} title="Contact Us" />
            <ContactUs />
        </div>
    )
}

export default Contact
