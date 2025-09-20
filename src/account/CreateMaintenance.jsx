import CreatMaintenaceForm from '@/assets/components/dashboard-components/CreatMaintenaceForm';
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import ManageComplaintsMain from '@/assets/components/dashboard-components/ManageComplaintsMain';
import React from 'react'
import { Helmet } from 'react-helmet'

function CreateMaintenance() {
  return (
    <>
      <Helmet>
        <title>Create Maintenance Request - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
            <CreatMaintenaceForm />
        </div>
      </div>
    </>
  )
}

export default CreateMaintenance;