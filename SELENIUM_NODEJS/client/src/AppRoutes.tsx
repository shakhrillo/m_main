// src/AppRoutes.tsx
import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardView from './views/dashboard';
import PaymentsHistoryView from './views/payments/history';
import PaymentsSubscriptionView from './views/payments/subscription';
import ScrapPlacesView from './views/scrap/places';
import ScrapReviewsView from './views/scrap/reviews';
import ScrapReviewsReviewView from './views/scrap/reviews/review';

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
    path: '',
    element: <DashboardView />,
    children: [
      {
        path: "reviews",
        element: <ScrapReviewsView />,
        children: [
          {
            path: ":place",
            element: <ScrapReviewsReviewView />,
          },
        ]
      },
      {
        path: "places",
        element: <ScrapPlacesView />
      },
      {
        path: "payments",
        element: <Outlet />,
        children: [
          {
            path: "subscription",
            element: <PaymentsSubscriptionView />,
          },
          {
            path: "history",
            element: <PaymentsHistoryView />,
          },
        ]
      }
    ]
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
