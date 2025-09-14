// import React from 'react'

// export default function ChangeUserPassword() {
//   return (
//     <div>ChangeUserPassword</div>
//   )
// }

import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import ChangeUserPasswordMain from '@/assets/components/dashboard-components/ChangeUserPasswordMain'

export default function ChangeUserPassword() {
  return (
    <>
      <Helmet>
        <title>Change User Password - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <ChangeUserPasswordMain />
        </div>
      </div>
    </>
  )
}
