import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import AdminRoomRequestMain from '@/assets/components/hostel-components/AdminRoomRequestsMain'
import AddNewUserMain from '@/assets/components/dashboard-components/AddNewUserMain'

function AddNewUser() {
  return (
    <>
      <Helmet>
        <title>Add Users - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AddNewUserMain />
        </div>
      </div>
    </>
  )
}

export default AddNewUser;