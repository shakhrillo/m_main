import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Help from "../pages/Help";
import Info from "../pages/Info";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Payments from "../pages/Payments";
import Receipts from "../pages/Receipts";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import ReviewsList from "../pages/ReviewsList";
import Scrap from "../pages/Scrap";
import Security from "../pages/Security";
import Settings from "../pages/Settings";
import SingleReview from "../pages/SingleReview";
import Usage from "../pages/Usage";
import User from "../pages/User";
import Users from "../pages/Users";
import ValidatedUrls from "../pages/ValidatedUrls";
import { AuthGuard } from "./AuthGuard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { path: "", element: <Navigate to={"reviews"} replace /> },
          {
            path: "reviews",
            element: <ReviewsList />,
          },
          {
            path: "reviews/:place",
            element: <SingleReview />,
          },
          { path: "validates", element: <ValidatedUrls /> },
          { path: "scrap", element: <Scrap /> },
          { path: "user", element: <User /> },
          { path: "users", element: <Users /> },
          { path: "security", element: <Security /> },
          { path: "settings", element: <Settings /> },
          { path: "help", element: <Help /> },
          { path: "info", element: <Info /> },
          { path: "dashboard", element: <Usage /> },
          { path: "payments", element: <Payments /> },
          { path: "receipts", element: <Receipts /> },
        ],
      },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
