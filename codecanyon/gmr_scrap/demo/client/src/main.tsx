import { createRoot } from "react-dom/client"
import App from "./App"
import { FirebaseProvider } from "./contexts/FirebaseProvider"
import "./index.scss"
import { MenuProvider } from "./context"

const container = document.getElementById("root")

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

if (container) {
  const root = createRoot(container)

  root.render(
    <MenuProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </MenuProvider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
