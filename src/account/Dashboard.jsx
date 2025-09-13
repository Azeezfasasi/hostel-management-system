import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import DashStats from '@/assets/components/dashboard-components/DashStats'
import DashWelcome from '@/assets/components/dashboard-components/DashWelcome'
import RoomManager from '@/assets/components/hostel-components/RoomManagement'
import HostelManager from '@/assets/components/hostel-components/HostelManager'

function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <DashWelcome />
          <DashStats />
        </div>
      </div>
    </>
  )
}

export default Dashboard