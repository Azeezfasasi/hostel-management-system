import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import MyComplaintsMain from '@/assets/components/dashboard-components/MyComplaintsMain';
import React from 'react'
import { Helmet } from 'react-helmet'

function MyComplaints() {
  return (
    <>
      <Helmet>
        <title>My Complaints - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
            <MyComplaintsMain />
        </div>
      </div>
    </>
  )
}

export default MyComplaints;