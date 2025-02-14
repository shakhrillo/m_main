import { APIProvider } from "@vis.gl/react-google-maps";
import AppRouter from "./routes/AppRoutes";
import { Favicon } from "./components/Favicon";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * The main application component.
 * @returns The main application component.
 */
const App = () => (
  <>
    <Favicon />
    <APIProvider apiKey={ GOOGLE_MAPS_API_KEY }>
      <AppRouter />
    </APIProvider>
  </>
);

export default App;
