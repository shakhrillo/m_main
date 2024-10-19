import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { store } from "./app/store"
import Navbar from "./components/navbar"
import "./index.scss"
import AuthView from "./views/auth"
import DashboardView from "./views/dashboard"
import PricingView from "./views/pricing"
import ScrapPlacesView from "./views/scrap/places"
import ScrapReviewsView from "./views/scrap/reviews"
import Subscription from "./views/subscription"
import UsersView from "./views/user"
import ScrapReviewsReviewView from "./views/scrap/reviews/review"

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardView />,
    children: [
      {
        path: "scrap",
        element: <Outlet />,
        children: [
          {
            path: "reviews",
            element: <ScrapReviewsView />,
          },
          {
            path: "review/:place",
            element: <ScrapReviewsReviewView />,
          },
          {
            path: "places",
            element: <ScrapPlacesView />
          }
        ]
      },
      {
        path: "payments",
        element: <Outlet />,
        children: [
          {
            path: "subscription",
            element: <Subscription />,
          },
        ]
      }
    ]
  },
  {
    path: "/user",
    element: <UsersView />,
  },
  {
    path: "/about",
    element: <div>About page</div>,
  },
  {
    path: "/price",
    element: <PricingView />,
  },
  {
    path: "/contact",
    element: <div>Contact page</div>,
  },
  {
    path: "/auth",
    element: <AuthView />,
  }
])

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={store}>
      <Navbar />
      <RouterProvider router={router} />
    </Provider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
