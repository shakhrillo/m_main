import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import PreloaderLayout from "../layouts/PreloaderLayout/PreloaderLayout";
import Login from "../pages/auth/Login";
import Logout from "../pages/auth/Logout";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import Help from "../pages/Help";
import Payments from "../pages/Payments";
import ReviewsList from "../pages/reviews/ReviewsList";
import SingleReview from "../pages/reviews/SingleReview";
import Scrap from "../pages/scrap";
import Settings from "../pages/Settings";
import User from "../pages/User";
import Users from "../pages/Users";
import Machines from "../pages/Machines";
import Info from "../pages/Info";
import Usage from "../pages/Usage";
import ValidatedUrls from "../pages/reviews/ValidatedUrls";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { path: "", element: <Navigate to={"reviews"} replace /> },
          {
            path: "reviews",
            element: <Outlet />,
            children: [
              { path: "", element: <ReviewsList /> },
              { path: ":place", element: <SingleReview /> },
            ],
          },
          { path: "validates", element: <ValidatedUrls /> },
          { path: "scrap", element: <Scrap /> },
          { path: "user", element: <User /> },
          { path: "users", element: <Users /> },
          { path: "machines", element: <Machines /> },
          { path: "settings", element: <Settings /> },
          { path: "help", element: <Help /> },
          { path: "info", element: <Info /> },
          { path: "dashboard", element: <Usage /> },
          { path: "payments", element: <Payments /> },
        ],
      },
    ],
  },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
  { path: "logout", element: <Logout /> },
  { path: "reset-password", element: <ResetPassword /> },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const AppRoutes = () => {
  return (
    <PreloaderLayout>
      <RouterProvider router={router} />
    </PreloaderLayout>
  );
};

export default AppRoutes;
