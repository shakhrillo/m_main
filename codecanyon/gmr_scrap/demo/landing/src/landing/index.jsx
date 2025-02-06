import CanGet from "./canGet";
import DocumnetationSection from "./documentation";
import Faq from "./faq";
import Footer from "./footer";
import Integration from "./integration";
import Main from "./main";
import Navbar from "./navbar";
import Pricing from "./pricing";
import Testimonal from "./testimonal";

function Landing() {
  return (
    <div className="main">
      <Navbar />
      <Main />
      <CanGet />
      <Testimonal />
      <DocumnetationSection />
      <Integration />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}
export default Landing;
