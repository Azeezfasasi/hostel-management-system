import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import StudentRoomHistory from '@/assets/components/hostel-components/StudentRoomHistory'

export default function RoomHistory() {
  return (
    <>
      <Helmet>
        <title>Current Room Allocation - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <StudentRoomHistory />
        </div>
      </div>
    </>
  )
}
