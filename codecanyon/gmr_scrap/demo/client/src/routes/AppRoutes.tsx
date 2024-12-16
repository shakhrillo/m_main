import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom"
import PrivateRoute from "../components/PrivateRoute"
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout"
import PreloaderLayout from "../layouts/PreloaderLayout/PreloaderLayout"
import Login from "../pages/auth/Login"
import Logout from "../pages/auth/Logout"
import Register from "../pages/auth/Register"
import ResetPassword from "../pages/auth/ResetPassword"
import Help from "../pages/Help"
import Payments from "../pages/Payments"
import ReviewsList from "../pages/reviews/ReviewsList"
import SingleReview from "../pages/reviews/SingleReview"
import Scrap from "../pages/Scrap"
import Settings from "../pages/Settings"
import User from "../pages/User"
import Users from "../pages/Users"
import Machines from "../pages/Machines"
import Info from "../pages/Info"
import Usage from "../pages/Usage"

const reviewsRoutes = {
  path: "reviews",
  element: <Outlet />,
  children: [
    { path: "", element: <ReviewsList /> },
    { path: ":place", element: <SingleReview /> },
  ],
}

const dashboardRoutes = {
  path: "",
  element: <DashboardLayout />,
  children: [
    { path: "", element: <Navigate to={"reviews"} replace /> },
    reviewsRoutes,
    { path: "scrap", element: <Scrap /> },
    { path: "user", element: <User /> },
    { path: "users", element: <Users /> },
    { path: "machines", element: <Machines /> },
    { path: "settings", element: <Settings /> },
    { path: "help", element: <Help /> },
    { path: "info", element: <Info /> },
    { path: "usage", element: <Usage /> },
    { path: "payments", element: <Payments /> },
  ],
}

const authRoutes = {
  path: "auth",
  element: <Outlet />,
  children: [
    { path: "register", element: <Register /> },
    { path: "login", element: <Login /> },
    { path: "logout", element: <Logout /> },
    { path: "reset-password", element: <ResetPassword /> },
  ],
}

const router = createBrowserRouter(
  [
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
  ],
  {
    basename: "/dashboard/",
  },
)

const AppRoutes = () => {
  return (
    <PreloaderLayout>
      <RouterProvider router={router} />
    </PreloaderLayout>
  )
}

export default AppRoutes
