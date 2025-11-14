import React from 'react'
import Breadcrumb from '../Breadcrumb'
import EventTable from './EventTable'

const Event = () => {
  return (
    <div>
        <Breadcrumb lable='Event'/>
        <section className='mt-5'>
            <EventTable/>
        </section>
    </div>
  )
}

export default Event