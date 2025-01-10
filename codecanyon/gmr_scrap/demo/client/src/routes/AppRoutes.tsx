import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { DashboardLayout } from "../layouts";
import {
  Dashboard,
  Help,
  Info,
  Login,
  Logout,
  Payments,
  Receipts,
  Register,
  ResetPassword,
  ReviewsList,
  Scrap,
  Security,
  Settings,
  SingleReview,
  User,
  Users,
  ValidatedURLs,
} from "../pages";
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
          { path: "validates", element: <ValidatedURLs /> },
          { path: "scrap", element: <Scrap /> },
          { path: "user", element: <User /> },
          { path: "users", element: <Users /> },
          { path: "security", element: <Security /> },
          { path: "settings", element: <Settings /> },
          { path: "help", element: <Help /> },
          { path: "info", element: <Info /> },
          { path: "dashboard", element: <Dashboard /> },
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
