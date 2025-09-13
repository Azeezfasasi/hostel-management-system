import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardHeader from '@/assets/components/dashboard-components/DashboardHeader'
import DashMenu from '@/assets/components/dashboard-components/DashMenu'
import DashStats from '@/assets/components/dashboard-components/DashStats'
import DashWelcome from '@/assets/components/dashboard-components/DashWelcome'
import { useUser } from '@/assets/context-api/user-context/UseUser';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user && !user.onboardingCompleted) {
      navigate('/onboarding/onboarding');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="pt-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 animate-pulse">Loading...</h1>
        <p className="text-lg text-gray-600">Please wait while we load your dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Hostel Management</title>
      </Helmet>
      <DashboardHeader />
      <div className='flex flex-row justify-start gap-4'>
        <div className='hidden lg:block w-[20%]'>
          <DashMenu />
        </div>
        <div className='w-full lg:w-[80%]'>
          <DashWelcome />
          <DashStats />
        </div>
      </div>
    </>
  )
}

export default Dashboard