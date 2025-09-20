import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import ManageAllMaintenance from '@/assets/components/dashboard-components/ManageAllMaintenance';
import ManageComplaintsMain from '@/assets/components/dashboard-components/ManageComplaintsMain';
import React from 'react'
import { Helmet } from 'react-helmet'

function AllMaintenanceRequests() {
  return (
    <>
      <Helmet>
        <title>All Maintenance Requests - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
            <ManageAllMaintenance />
        </div>
      </div>
    </>
  )
}

export default AllMaintenanceRequests;