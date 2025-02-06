import documentationBanner from "../img/documentation.png";

function Integration() {
  return (
    <section id="integration" className="integration-section bg-indigo">
      <div className="section__area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="section__content section-title text-center">
              <h1 className="home-section__content--title">
                Integration / API
              </h1>
              {/* <!-- <p className="home-section__content--subtitle">We have found 150,000,000+ leades for thousands
                            of businesses around the world this year.</p> --> */}
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="integration__card">
                <div className="d-flex gap-3 align-items-center">
                  <div className="integration__card__icon"></div>
                  <h5 className="integration__card__title">
                    Integrate with Other Tools
                  </h5>
                </div>
                <p className="integration__card__subtitle">
                  Effortlessly integrate our Google Maps Scrapers with the tools
                  you rely on most. Octoparse makes it simple to connect with{" "}
                  <a
                    id="link"
                    // target="_blank"
                    href="https://www.octoparse.ai/"
                  >
                    Octoparse AI
                  </a>
                  , Zapier, Google Sheets, and a variety of databases, ensuring
                  that your data flows smoothly between platforms.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="integration__card">
                <div className="d-flex gap-3 align-items-center">
                  <div className="integration__card__icon"></div>
                  <h5 className="integration__card__title">
                    Integrate with Other Tools
                  </h5>
                </div>
                <p className="integration__card__subtitle">
                  Effortlessly integrate our Google Maps Scrapers with the tools
                  you rely on most. Octoparse makes it simple to connect with{" "}
                  <a
                    id="link"
                    // target="_blank"
                    href="https://www.octoparse.ai/"
                  >
                    Octoparse AI
                  </a>
                  , Zapier, Google Sheets, and a variety of databases, ensuring
                  that your data flows smoothly between platforms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Integration;
