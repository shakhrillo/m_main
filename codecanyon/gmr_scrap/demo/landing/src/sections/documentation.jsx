import documentationBanner from "../img/documentation.png";
function Documnetation() {
  return (
    <section id="documentation" className="documentation-section">
      <div className="section__area overflow-hidden">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="documentation-image">
                <img src={documentationBanner} alt="documentation-image" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="documentation__content">
                <h2 className="documentation__content__title">Documentation</h2>
                <p className="documentation__content__subtitle">
                  This documentation offers an essential overview of our
                  templates’ functionality and customization options. We
                  strongly advise reviewing the guide thoroughly before
                  beginning your project with our template.
                </p>
                <a
                  className="geo-btn geo-btn__default"
                  href="./documentation.html"
                >
                  Read Full Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Documnetation;
