import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss";

const containerId = "root";
const container = document.getElementById(containerId);

if (!container) {
  throw new Error(
    `Root element with ID ${containerId} was not found in the document. Ensure there is a corresponding HTML element with the ID ${containerId} in your HTML file.`,
  );
}

const root = createRoot(container);
root.render(<App />);
