import AllDamagedReportMain from '@/assets/components/dashboard-components/AllDamagedReportMain';
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import React from 'react'
import { Helmet } from 'react-helmet'
import { useUser } from '@/assets/context-api/user-context/UseUser';

function AllDamagedReports() {
  const { user } = useUser();

  return (
    <>
      <Helmet>
        <title>All Damaged Reports - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AllDamagedReportMain studentId={user._id} />
        </div>
      </div>
    </>
  )
}

export default AllDamagedReports;