import React from 'react'
import Breadcrumb from '../Breadcrumb'
import QueriesTable from './QueriesTable'

const Queries = () => {
  return (
    <div>
      <Breadcrumb lable="Queries" />
       <section className='mt-5'>
        <QueriesTable />
      </section>
    </div>
  )
}

export default Queries
