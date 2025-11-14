import React from 'react'
import Breadcrumb from '../Breadcrumb'
import CommentTable from './CommentTable'

const Comments = () => {
  return (
    <div>
        <Breadcrumb lable="Comments" />
       <section className='mt-5'>
        <CommentTable />
      </section>
    </div>
  )
}

export default Comments
