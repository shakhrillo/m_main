import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import
  {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom"
import { store } from "./app/store"
import Navbar from "./components/navbar"
import "./index.css"
import DashboardView from "./views/dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Landing page will be here</div>,
  },
  {
    path: "/dashboard",
    element: <DashboardView />,
    children: [
      {
        path: "user",
        element: <div>Dashboard page will be here</div>,
      }
    ]
  },
  {
    path: "/about",
    element: <div>About page</div>,
  },
  {
    path: "/price",
    element: <div>Price page</div>,
  },
  {
    path: "/contact",
    element: <div>Contact page</div>,
  }
]);

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={store}>
      <Navbar />
      <RouterProvider router={router} />
    </Provider>
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
