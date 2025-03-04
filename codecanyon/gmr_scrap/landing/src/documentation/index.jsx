import logo from "../img/logo-with-text.svg";

import LeftSection from "./leftSection";
import CenterSection from "./centerSection";

function Documentation() {
  return (
    <div className="main">
      <nav class="geo-navbar border-bottom fixed-top bg-white">
        <div class="px-4">
          <div class="geo-navbar__content">
            <a
              class="geo-navbar__brand"
              href="./index.html"
              aria-label="GeoScrapper Home"
            >
              <img src={logo} alt="GeoScrapper Logo" />
            </a>
            <button class="geo-btn geo-btn__style-two">
              Start a free trial
            </button>
          </div>
        </div>
      </nav>
      <main class="documentation w-100">
        <div className="container-fluid">
          <div class="row">
            <LeftSection />
            <CenterSection />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Documentation;
