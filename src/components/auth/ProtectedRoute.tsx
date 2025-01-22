import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import LoadingState from '../LoadingState.tsx';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
