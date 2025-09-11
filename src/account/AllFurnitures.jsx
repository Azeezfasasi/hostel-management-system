import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import RoomAssignment from '@/assets/components/hostel-components/RoomAssignment'
import RoomAssignmentForm from '@/assets/components/hostel-components/RoomAssignmentForm'
import FurnitureList from '@/assets/components/hostel-components/FurnitureList'

function AllFurnitures() {
  return (
    <>
      <Helmet>
        <title>All Furnitures - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <FurnitureList />
        </div>
      </div>
    </>
  )
}

export default AllFurnitures