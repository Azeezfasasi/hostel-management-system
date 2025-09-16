import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import HostelManager from '@/assets/components/hostel-components/HostelManager';
import StudentPendingPayments from '@/assets/components/hostel-components/StudentPendingPayments';
import React from 'react'
import { Helmet } from 'react-helmet'

export default function PendingPayment() {
  return (
    <>
      <Helmet>
        <title>Pending Payments - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <StudentPendingPayments />
        </div>
      </div>
    </>
  )
}
