import "./App.css";
import Documentation from "./documentation";
import { BrowserRouter, Routes, Route } from "react-router";

import Landing from "./landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </BrowserRouter>
  );
  // <Documentation />;
}

export default App;
