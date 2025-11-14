import DonateUs from '@/src/components/Web/DonateUs';
import React from 'react'
interface Props {
  params: Promise<{
    id: string;
  }>;
}

const page = async({params}:Props) => {
  const { id } = await params;
    return (
    <div>
      <DonateUs id={id} />
    </div>
  )
}

export default page
