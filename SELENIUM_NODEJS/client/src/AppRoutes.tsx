// src/AppRoutes.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: 'Home Page',
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: 'Dashboard Page',
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
