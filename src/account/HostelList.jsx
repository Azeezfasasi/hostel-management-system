import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import HostelManager from '@/assets/components/hostel-components/HostelManager';
import React from 'react'
import { Helmet } from 'react-helmet'

function HostelList() {
  return (
    <>
      <Helmet>
        <title>Hostel List - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <HostelManager />
        </div>
      </div>
    </>
  )
}

export default HostelList;