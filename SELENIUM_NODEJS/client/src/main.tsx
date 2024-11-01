import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { store } from "./app/store"
import { FirebaseProvider } from "./contexts/FirebaseProvider"
import "./index.scss"
import AuthView from "./views/auth"
import DashboardView from "./views/dashboard"
import PaymentsHistoryView from "./views/payments/history"
import PaymentsSubscriptionView from "./views/payments/subscription"
import PricingView from "./views/pricing"
import ScrapPlacesView from "./views/scrap/places"
import ScrapReviewsView from "./views/scrap/reviews"
import ScrapReviewsReviewView from "./views/scrap/reviews/review"
import UsersView from "./views/user"
import App from "./App"


const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthView />,
  },
  {
    path: "/ss",
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
  }
])

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={store}>
      <FirebaseProvider>
        <App />
        {/* <RouterProvider router={router} /> */}
      </FirebaseProvider>
    </Provider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
