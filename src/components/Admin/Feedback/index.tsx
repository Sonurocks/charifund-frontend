import React from 'react'
import Breadcrumb from '../Breadcrumb'
import FeedbackTable from './FeedbackTable'

const Feedback = () => {
  return (
    <div>
      <Breadcrumb lable="Feedback" />
      <section className="mt-5">
        <FeedbackTable />
      </section>
    </div>
  )
}

export default Feedback
