import React from 'react'
import { ourteambanner } from '@/public/assets'
import VolunteerTeam from '../Volunteer/VolunteerTeam'
import PageBanner from '@/src/helper/PageBanner'

const Teams = () => {
    return (
        <div>
            <PageBanner pageName="Team" 
               bgImage={ourteambanner} 
               title="Our Dedicated Team"
               tagline="Supporting People • Empowering Communities"
               description="Our dedicated team of volunteers, professionals, and social workers works together to create positive change in society. With compassion, commitment, and teamwork, we strive to support children, women, families, and communities in need. Together, We Serve. Together, We Create Change."
            />
            <div className="py-10">
                <VolunteerTeam hideViewAll={true} showPagination={true} limit={8} />
            </div>
        </div>
    )
}

export default Teams
