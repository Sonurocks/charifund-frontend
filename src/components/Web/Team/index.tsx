import React from 'react'
import { ourteambanner } from '@/public/assets'
import Ourteams from './Ourteam'
import PageBanner from '@/src/helper/PageBanner'

const Teams = () => {
    return (
        <div>
            <PageBanner bgImage={ourteambanner} title="Our Team" />
            <Ourteams />
        </div>
    )
}

export default Teams
