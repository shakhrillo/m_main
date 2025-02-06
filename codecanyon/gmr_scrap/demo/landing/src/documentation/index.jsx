import Accordion from "react-bootstrap/Accordion";

import logo from "../img/logo-with-text.svg";
import file from "../img/downloadFile.svg";
import clip from "../img/clip.svg";
import headset from "../img/headset.svg";
import thumpUp from "../img/thumpUp.svg";
import thumpDown from "../img/thumpDown.svg";

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
        <div class="row">
          <aside class="col-2 d-flex documentation__sidebar"></aside>

          <div class="documentation__main-content col ps-4">
            <div class="row">
              <div class="col">
                <div class="documentation__body">
                  <h1 class="documentation__title">Introduction</h1>
                  <p class="documentation__subtitle">
                    This section offers a comprehensive overview of the project,
                    detailing its purpose, key features, and goals.
                  </p>
                  <div>
                    <p class="documentation__text">
                      Introducing Trezo, a cutting-edge, multi-framework admin
                      dashboard template designed with both style and
                      functionality in mind. Whether you're working on small
                      personal projects or large-scale web and mobile
                      applications, Trezo provides a seamless experience
                      tailored to your needs. With dedicated dashboard versions
                      for:
                    </p>
                    <ul class="documentation__list">
                      <li>Tailwind CSS</li>
                      <li>Angular v18+</li>
                      <li>Next.js</li>
                      <li>Bootstrap</li>
                      <li>SCSS</li>
                    </ul>
                    <h2 class="documentation__section-title">
                      Support & Assistance
                    </h2>
                    <hr />
                    <h2 class="documentation__subsection-title">
                      For Existing Customers: Get Help with Setup and More
                    </h2>
                  </div>
                </div>
              </div>

              <div class="col-2">
                <div class="documentation__navigation d-flex flex-column gap-3">
                  <div className="documentation__navigation-item d-flex gap-1">
                    <img src={file} />
                    <h6 class="documentation__navigation-title m-0">
                      Download pdf
                    </h6>
                  </div>
                  <div className="documentation__navigation-item d-flex gap-1">
                    <img src={clip} />
                    <h6 class="documentation__navigation-title m-0">
                      Copy link
                    </h6>
                  </div>
                  <hr />
                  <h5>On this page</h5>
                  <div className="documentation__navigation-item d-flex gap-1">
                    <h6 class="documentation__navigation-title m-0">
                      Overview
                    </h6>
                  </div>
                  <div className="documentation__navigation-item d-flex gap-1">
                    <h6 class="documentation__navigation-title m-0">
                      Dashboard and enabling shipment
                    </h6>
                  </div>
                  <div className="documentation__navigation-item d-flex gap-1">
                    <h6 class="documentation__navigation-title m-0">
                      Shipment tracking Dashboard
                    </h6>
                  </div>
                  <hr />
                  <h5>Do you need help?</h5>
                  <div className="documentation__navigation-item d-flex gap-1">
                    <img src={headset} />
                    <h6 class="documentation__navigation-title m-0">Chatbot</h6>
                  </div>
                  <hr />
                  <h5>Is this page helpfull?</h5>
                  <div className="documentation__navigation-item d-flex justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                      <img src={thumpUp} />
                      <h6 class="documentation__navigation-title m-0">Yes</h6>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <img src={thumpDown} />
                      <h6 class="documentation__navigation-title m-0">No</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Documentation;
