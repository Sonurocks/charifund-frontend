import DonateUs from '@/src/components/Web/DonateUs'
import React, { Suspense } from 'react';

export const metadata = {
  title: "GiveSphere | Donate & Support",
  description: "Make a direct contribution to support meaningful social impact and transparent charitable initiatives.",
};

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
