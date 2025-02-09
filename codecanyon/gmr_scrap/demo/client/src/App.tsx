import { APIProvider } from "@vis.gl/react-google-maps";
import AppRouter from "./routes/AppRoutes";
const App = () => (
  <APIProvider
    apiKey={
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBeV1xnm8AQsQljyYCYT11rFlF9HoY4pRo"
    }
  >
    <AppRouter />
  </APIProvider>
);

export default App;
