import "./App.css";

import Main from "./sections/main";
import CanGet from "./sections/canGet";
import Testimonal from "./sections/testimonal";
import Documnetation from "./sections/documentation";
import Integration from "./sections/integration";
import Faq from "./sections/faq";
import Footer from "./sections/footer";
import Pricing from "./sections/pricing";
import Navbar from "./sections/navbar";

function App() {
  return (
    <div className="main">
      <Navbar />
      <Main />
      <CanGet />
      <Testimonal />
      <Documnetation />
      <Integration />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}

export default App;
