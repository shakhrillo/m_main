import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { DashboardLayout } from "../layouts";
import {
  Auth,
  Receipt,
  Dashboard,
  DockerContainer,
  DockerContainers,
  DockerImage,
  ImagesList,
  Help,
  Info,
  Login,
  Logout,
  Payments,
  Receipts,
  Register,
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
          { path: "reviews", element: <ReviewsList /> },
          { path: "reviews/:reviewId", element: <SingleReview /> },
          { path: "validates", element: <ValidatedURLs /> },
          { path: "scrap", element: <Scrap /> },
          { path: "scrap/:scrapId", element: <Scrap /> },
          { path: "users", element: <Users /> },
          { path: "users/:userId", element: <User /> },
          { path: "security", element: <Security /> },
          { path: "settings", element: <Settings /> },
          { path: "help", element: <Help /> },
          { path: "info", element: <Info /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "payments", element: <Payments /> },
          { path: "receipts", element: <Receipts /> },
          { path: "receipts/:receiptId", element: <Receipt /> },
          { path: "containers", element: <DockerContainers /> },
          { path: "containers/:containerId", element: <DockerContainer /> },
          { path: "images", element: <ImagesList /> },
          { path: "images/:imgId", element: <DockerImage /> },
        ],
      },
    ],
  },
  {
    path: "auth",
    element: <Auth />,
    children: [
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },
      { path: "", element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth/login" replace />,
  },
]);

/**
 * AppRoutes component
 * @returns {ReactElement} AppRoutes component
 */
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
