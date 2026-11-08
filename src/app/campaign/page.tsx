import Campaign from '@/src/components/Web/Campaign'
import React from 'react';

export const metadata = {
  title: "GiveSphere | Campaigns",
  description: "Explore ongoing fundraising and social welfare campaigns on GiveSphere.",
};

const page = () => {
  return (
    <div>
      <Campaign />
    </div>
  )
}

export default page
