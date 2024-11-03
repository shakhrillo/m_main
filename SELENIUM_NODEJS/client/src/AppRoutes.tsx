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
import UsageView from './views/usage';
import UsersView from './views/user';

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
        path: "",
        element: "Dashboard",
      },
      {
        path: "reviews",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <ScrapReviewsView />,
          },
          {
            path: ":place",
            element: <ScrapReviewsReviewView />,
          },
        ]
      },
      {
        path: "usage",
        element: <UsageView />,
      },
      {
        path: "user",
        element: <UsersView />
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
            path: "",
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
