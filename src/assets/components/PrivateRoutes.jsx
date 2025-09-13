import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context-api/user-context/UseUser';
import BounceLoader from "react-spinners/BounceLoader";

const PrivateRoutes = () => {
  const { user, token, loading } = useUser();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen gap-2'>
        <BounceLoader /> <span className="font-bold">Loading...</span>
      </div>
    );
  }

  return (user && token) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;