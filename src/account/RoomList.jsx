import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import RoomManager from '@/assets/components/hostel-components/RoomManagement'
import React from 'react'
import { Helmet } from 'react-helmet'

function RoomList() {
  return (
    <>
      <Helmet>
        <title>Room List - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <RoomManager />
        </div>
      </div>
    </>
  )
}

export default RoomList