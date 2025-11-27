import AllAnnouncements from '@/assets/components/dashboard-components/AllAnnouncements';
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import React from 'react'
import { Helmet } from 'react-helmet'

function ManageAnnoucement() {
  return (
    <>
      <Helmet>
        <title>Manage Announcements - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AllAnnouncements />
        </div>
      </div>
    </>
  )
}

export default ManageAnnoucement;