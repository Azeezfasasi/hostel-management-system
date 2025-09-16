import React from 'react'
import HeaderSection from './assets/components/home-components/HeaderSection'
import FooterSection from './assets/components/home-components/FooterSection'
import { Helmet } from 'react-helmet'
import HomeRoomAllocation from './assets/components/home-components/HomeRoomAllocation'

export default function RoomAvailability() {
  return (
    <>
    <Helmet>
        <title>Room Availability - Hostel Portal</title>
        <meta name="description" content="Check the availability of rooms in the hostel." />
    </Helmet>
    <HeaderSection />
    <HomeRoomAllocation />
    <FooterSection />
    </>
  )
}
