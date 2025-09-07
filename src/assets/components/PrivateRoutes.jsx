import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context-api/user-context/UseUser';
// import Spinner from '../Spinner';
import BounceLoader from "react-spinners/BounceLoader";

const PrivateRoutes = () => {
  const { user, token, loading } = useUser();

  if (loading) {
    return <BounceLoader />;
  }

  return (user && token) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;