import React, { useState, useEffect } from 'react';
import { useUser } from '@/assets/context-api/user-context/UseUser';

const DashWelcome = () => {
  const [greeting, setGreeting] = useState('');
  const { user } = useUser();

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

  return (
    <div className="pt-8 w-full max-w-lg">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        {greeting} {user?.firstName}
      </h1>
      <p className="text-lg text-gray-600">
        Welcome to your Hostel Management System Portal!
      </p>
    </div>
  );
};

export default DashWelcome;
