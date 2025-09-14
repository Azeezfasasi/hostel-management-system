import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import AllNewsletterMain from '@/assets/components/dashboard-components/AllNewsletterMain'

export default function AllNewsletter() {
  return (
    <>
      <Helmet>
        <title>All Newsletters - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AllNewsletterMain />
        </div>
      </div>
    </>
  )
}

