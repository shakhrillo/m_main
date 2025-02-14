import { APIProvider } from "@vis.gl/react-google-maps";
import AppRouter from "./routes/AppRoutes";
import { Favicon } from "./components/Favicon";
import { SEO } from "./components/SEO";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * The main application component.
 * @returns The main application component.
 */
const App = () => (
  <>
    <Favicon />
    <SEO />
    <APIProvider apiKey={ GOOGLE_MAPS_API_KEY }>
      <AppRouter />
    </APIProvider>
  </>
);

export default App;
