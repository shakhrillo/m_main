import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { DashboardLayout } from "../layouts";
import {
  Dashboard,
  DockerContainer,
  DockerContainers,
  DockerImage,
  DockerImages,
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
import { DockerInfo } from "../pages/DockerInfo";
import { Receipt } from "../pages/Receipt";
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
            path: "reviews/:reviewId",
            element: <SingleReview />,
          },
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
          { path: "docker", element: <DockerInfo /> },
          { path: "containers", element: <DockerContainers /> },
          { path: "containers/:containerId", element: <DockerContainer /> },
          { path: "images", element: <DockerImages /> },
          { path: "images/:imgId", element: <DockerImage /> },
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
