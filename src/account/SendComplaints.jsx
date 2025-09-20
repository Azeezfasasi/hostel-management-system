import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import SendComplaintsMain from '@/assets/components/dashboard-components/SendComplaintsMain';
import React from 'react'
import { Helmet } from 'react-helmet'

function SendComplaints() {
  return (
    <>
      <Helmet>
        <title>Send Complaints - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
            <SendComplaintsMain />
        </div>
      </div>
    </>
  )
}

export default SendComplaints;