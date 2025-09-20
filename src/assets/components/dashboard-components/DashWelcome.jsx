import React, { useState, useEffect } from 'react';
import { useUser } from '@/assets/context-api/user-context/UseUser';
import { Link } from 'react-router-dom';


const DashWelcome = () => {
  const [greeting, setGreeting] = useState('');
  const { user, loading } = useUser();

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Good morning,';
      } else if (currentHour < 18) {
        return 'Good afternoon,';
      } else {
        return 'Good evening,';
      }
    };
    setGreeting(getGreeting());
  }, []);

  // Update greeting if user changes (e.g. after login fetch)
  useEffect(() => {
    if (user) {
      const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
          return 'Good morning,';
        } else if (currentHour < 18) {
          return 'Good afternoon,';
        } else {
          return 'Good evening,';
        }
      };
      setGreeting(getGreeting());
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="pt-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 animate-pulse">Loading...</h1>
        <p className="text-lg text-gray-600">Please wait while we load your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="pt-8 px-4 md:px-0 w-full md:max-w-[80%]">
      <h1 className="text-[24px] md:text-3xl font-extrabold text-gray-900 mb-2">
        👋 {greeting} {user.firstName}
      </h1>
      {/* {isStudent && !user.onboardingCompleted && (
      <p className="text-lg text-gray-600">
        Welcome to your Hostel Management System Portal! For all students who have not yet finalized their enrollment, please complete your registration details using this <Link to="/account/profile" className='text-blue-600 font-semibold underline'>link</Link>.
      </p>
      )}
      {isStudent && (
      <p className="text-lg text-gray-600">
        Welcome to your Hostel Management System Portal! Here, you can easily manage your hostel accommodations, view room assignments, submit maintenance requests, and stay updated with important announcements. If you need assistance, please contact the hostel administration.
      </p>
      )}
      {(isAdmin || isStaff || isSuperAdmin) && (
      <p className="text-lg text-gray-600">
        Welcome to your Hostel Management System Portal! Here, you can efficiently manage student accommodations, oversee room assignments, handle maintenance requests, and communicate important updates. If you need assistance, please contact the system administrator.
      </p>
      )} */}
    </div>
  );
};

export default DashWelcome;
