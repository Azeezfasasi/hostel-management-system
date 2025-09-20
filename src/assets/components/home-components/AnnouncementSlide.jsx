import React from 'react'

export default function AnnouncementSlide() {
  return (
    <div className="py-0 bg-gray-300">
      <div className="container mx-auto px-6 md:px-12">
        <marquee behavior="scroll" direction="left">
          <div className="flex space-x-8">
            <div className="text-red-600 font-bold">Hostel prayer meeting starts at 6:00 AM</div>
            <div className='text-blue-600 font-bold'>|</div>
            <div className="text-red-600 font-bold">Hostel cleaning day is on Saturday</div>
            <div className='text-blue-600 font-bold'>|</div>
            <div className="text-red-600 font-bold">Hostel movie night at 8:00 PM</div>
          </div>
        </marquee>
      </div>
    </div>
  )
}
