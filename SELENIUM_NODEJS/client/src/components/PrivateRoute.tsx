// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseProvider';

const PrivateRoute: React.FC = () => {
  const { user } = useFirebase();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
