import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import MyProfile from '@/assets/components/dashboard-components/MyProfile';
import React from 'react'
import { Helmet } from 'react-helmet'

export default function Profile() {
  return (
    <>
      <Helmet>
        <title>Profile - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <MyProfile />
        </div>
      </div>
    </>
  )
}

