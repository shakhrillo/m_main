import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import PreloaderLayout from "../layouts/PreloaderLayout/PreloaderLayout";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Help from "../pages/Help";
import Payments from "../pages/Payments";
import ReviewsList from "../pages/ReviewsList";
import SingleReview from "../pages/SingleReview";
import ValidatedUrls from "../pages/ValidatedUrls";
import Scrap from "../pages/Scrap";
import Settings from "../pages/Settings";
import User from "../pages/User";
import Users from "../pages/Users";
import Info from "../pages/Info";
import Usage from "../pages/Usage";

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
