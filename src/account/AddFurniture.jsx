import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import FurnitureForm from '@/assets/components/hostel-components/FurnitureForm'

function AddFurnitures() {
  return (
    <>
      <Helmet>
        <title>Add Furnitures - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <FurnitureForm />
        </div>
      </div>
    </>
  )
}

export default AddFurnitures