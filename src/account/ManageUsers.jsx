import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import AllUserMain from '@/assets/components/dashboard-components/AllUserMain'

function ManageUsers() {
  return (
    <>
      <Helmet>
        <title>Manage Users - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AllUserMain />
        </div>
      </div>
    </>
  )
}

export default ManageUsers