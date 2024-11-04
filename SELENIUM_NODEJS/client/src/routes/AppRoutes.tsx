import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom"
import PrivateRoute from "../components/PrivateRoute"
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout"
import PreloaderLayout from "../layouts/PreloaderLayout/PreloaderLayout"
import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import PaymentsHistoryView from "../views/payments/history"
import PaymentsSubscriptionView from "../views/payments/subscription"
import ScrapPlacesView from "../views/scrap/places"
import ScrapReviewsView from "../views/scrap/reviews"
import ScrapReviewsReviewView from "../views/scrap/reviews/review"
import UsageView from "../views/usage"
import UsersView from "../views/user"
import Logout from "../pages/Auth/Logout"

const reviewsRoutes = {
  path: "reviews",
  element: <Outlet />,
  children: [
    { path: "", element: <ScrapReviewsView /> },
    { path: ":place", element: <ScrapReviewsReviewView /> },
  ],
}

const paymentsRoutes = {
  path: "payments",
  element: <Outlet />,
  children: [
    { path: "", element: <PaymentsSubscriptionView /> },
    { path: "history", element: <PaymentsHistoryView /> },
  ],
}

const dashboardRoutes = {
  path: "",
  element: <DashboardLayout />,
  children: [
    { path: "", element: <Navigate to={"reviews"} replace /> },
    reviewsRoutes,
    { path: "usage", element: <UsageView /> },
    { path: "user", element: <UsersView /> },
    { path: "settings", element: "Settings" },
    { path: "help", element: "Help" },
    { path: "places", element: <ScrapPlacesView /> },
    paymentsRoutes,
  ],
}

const authRoutes = {
  path: "auth",
  element: <Outlet />,
  children: [
    { path: "register", element: <Register /> },
    { path: "login", element: <Login /> },
    { path: "logout", element: <Logout /> },
  ]
}


const router = createBrowserRouter([
  authRoutes,
  {
    path: "/",
    element: <PrivateRoute />,
    children: [dashboardRoutes],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])

const AppRoutes = () => {
  return (
    <PreloaderLayout>
      <RouterProvider router={router} />
    </PreloaderLayout>
  )
}

export default AppRoutes
