import AnnouncementForm from '@/assets/components/dashboard-components/AnnouncementForm';
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader';
import DashMenu from '@/assets/components/dashboard-components/DashMenu';
import React from 'react'
import { Helmet } from 'react-helmet'

function CreateAnnouncement() {
  return (
    <>
      <Helmet>
        <title>Create Announcement - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <AnnouncementForm />
        </div>
      </div>
    </>
  )
}

export default CreateAnnouncement;