import { termsAndConditions } from '@/public/assets'
import CookiePolicy from '@/src/components/Primary/CookiePolicy'
import PageBanner from '@/src/helper/PageBanner'
import React from 'react'

const page = () => {
  return (
    <div>
      <PageBanner bgImage={termsAndConditions} title="Cookies Policy" />

      <CookiePolicy />
    </div>
  )
}

export default page
