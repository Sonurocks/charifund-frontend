import DonateUs from '@/src/components/Web/DonateUs'
import React, { Suspense } from 'react';

export const metadata = {
  title: "charifund | Donate us"
}

const page = () => {
  return (
    <div>
      <Suspense fallback={null}>
        <DonateUs />
      </Suspense>
    </div>
  )
}

export default page
