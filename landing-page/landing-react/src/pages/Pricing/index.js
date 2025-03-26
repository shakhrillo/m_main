import bannerSrc from "../../assets/images/pricing.png";
import aboutBanner from "../../assets/images/about-1.png";

const Pricing = () => {
  return (
    <>
      <section
        class="d-table bg-half-170 bg-light w-100"
        style={{
          backgroundImage: `url(${bannerSrc})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <div class="bg-overlay"></div>
        <div class="container">
          <div class="row justify-content-center mt-5">
            <div class="col-lg-12 text-center">
              <div class="pages-heading title-heading">
                <h2 class="text-white title-dark">Pricing</h2>
                <p class="text-white-50 mb-0 mx-auto para-desc">
                  Choose a flexible pricing plan that fits your needs and
                  budget, with transparent costs, scalable features, and no
                  hidden fees.
                </p>
              </div>
            </div>
          </div>
          <div class="position-breadcrumb">
            <nav aria-label="breadcrumb" class="d-inline-block bg-white"></nav>
          </div>
        </div>
      </section>
      <div class="position-relative">
        <div class="text-white overflow-hidden shape">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <img src={aboutBanner} class="img-fluid" alt="about image" />
            </div>
            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
              <div class="ms-lg-4">
                <div class="d-flex mb-4">
                  <span class="text-primary h1 mb-0">
                    <span class="display-1 counter-value fw-bold">12</span>+
                  </span>
                  <span class="align-self-end h6 ms-2">
                    Years <br />
                    Experience
                  </span>
                </div>
                <div class="section-title">
                  <h4 class="mb-4 title">Who we are ?</h4>
                  <p class="text-muted">
                    We are a team of passionate professionals dedicated to
                    delivering innovative digital solutions. With expertise in
                    web and mobile development, UI/UX design, digital marketing,
                    and IT consulting, we help businesses grow and thrive in the
                    digital world. <br />
                    <br />
                    Our mission is to provide high-quality, scalable, and
                    results-driven solutions tailored to each client’s unique
                    needs. We believe in a customer-centric approach, where
                    technology meets creativity to build products that stand
                    out.
                    <br />
                    <br />
                    With years of experience and a commitment to excellence, we
                    ensure that every project we take on is executed with
                    precision, efficiency, and a focus on long-term success.
                  </p>
                  <a href="./contact.html" class="btn btn-primary">
                    Contact us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="container mt-100 mt-60">
          <div class="row justify-content-center">
            <div class="col col-12">
              <div class="text-center mb-4 pb-2 section-title">
                <h6 class="text-primary">Work Process</h6>
                <h4 class="mb-4 title">How do we works ?</h4>
                <p class="text-muted mb-0 mx-auto para-desc">
                  Our process is simple, transparent, and designed to deliver
                  the best results efficiently.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-4 col-md-6 mt-4 pt-2">
              <div class="card bg-light border-0 rounded shadow business-rate pricing pricing-primary">
                <div class="card-body">
                  <h6 class="text-primary text-uppercase fw-bold mb-4 name title">
                    Starter
                  </h6>
                  <div class="d-flex mb-4">
                    <span class="h4 mb-0 mt-2">$</span>
                    <span class="h1 mb-0 price">39</span>
                    <span class="align-self-end h4 mb-1">/mo</span>
                  </div>
                  <ul class="list-unstyled mb-0 ps-0">
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Basic website or app development
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Essential design & branding support
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Standart SEO optimization
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Limited customer support
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Access to core features
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4 col-md-6 mt-4 pt-2">
              <div class="card border-0 rounded shadow business-rate pricing pricing-primary">
                <div class="overflow-hidden ribbon ribbon-right ribbon-warning">
                  <span class="d-block shadow text-center h6 small">
                    {" "}
                    Best{" "}
                  </span>
                </div>
                <div class="card-body">
                  <h6 class="text-primary text-uppercase fw-bold mb-4 name title">
                    professional
                  </h6>
                  <div class="d-flex mb-4">
                    <span class="h4 mb-0 mt-2">$</span>
                    <span class="h1 mb-0 price">59</span>
                    <span class="align-self-end h4 mb-1">/mo</span>
                  </div>
                  <ul class="list-unstyled mb-0 ps-0">
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Custom website or app development
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Advanced UI/UX design & branding
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      SEO optimization & performance enhancements
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Priority customer support
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Integration with third-party tools
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Analytics & reporting features
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-4 col-md-6 mt-4 pt-2">
              <div class="card bg-light border-0 rounded shadow business-rate pricing pricing-primary">
                <div class="card-body">
                  <h6 class="text-primary text-uppercase fw-bold mb-4 name title"></h6>
                  <div class="d-flex mb-4">
                    <span class="h4 mb-0 mt-2">$</span>
                    <span class="h1 mb-0 price">79</span>
                    <span class="align-self-end h4 mb-1">/mo</span>
                  </div>
                  <ul class="list-unstyled mb-0 ps-0">
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Fully customized website or app development
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Premium UI/UX design & complete branding package
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Advanced SEO & marketing strategy
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Dedicated account manager & 24/7 priority support
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      API integrations & automation solutions
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Performance optimization & security enhancements
                    </li>
                    <li class="text-muted h6 mb-3">
                      <span class="h5 icon me-2">
                        <i class="text-primary bi bi-check-circle"></i>
                      </span>
                      Data analytics, reporting, and AI-driven insights
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="container mt-100 mt-60 pb-5">
          <div class="row justify-content-center">
            <div class="col-12 text-center">
              <div class="mb-4 pb-2 section-title">
                <h4 class="mb-4 title">Our Clients Said</h4>
                <p class="text-muted mb-0 mx-auto para-desc">
                  Discover what our clients have to say about working with us —
                  real experiences, real success stories, and the impact we've
                  made on their businesses.
                </p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-12 mt-4">
              <div id="customer-testi" class="tiny-three-item">
                <div class="tiny-slide">
                  <div class="row">
                    <div class="col-md-4 mb-1">
                      <div class="d-flex client-testi" name="clientsreview">
                        <img
                          src="https://mighty.tools/mockmind-api/content/human/65.jpg"
                          alt=""
                          class="rounded shadow avatar avatar-small client-image"
                          style={{ height: 65 + "px", width: 65 + "px" }}
                        />
                        <div class="flex-1 bg-white p-3 position-relative rounded shadow w-100 content">
                          <div
                            class="star-ratings"
                            title="5 Stars"
                            style={{
                              position: "relative",
                              boxSizing: "border-box",
                              display: "inline-block",
                            }}
                          >
                            <div
                              class="star-container"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                verticalAlign: "middle",
                                padding: "right 3px",
                                color: "rgb(241, 116, 37)",
                              }}
                            >
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                            </div>
                            <p class="text-muted mt-2">
                              "Thanks a ton! Great job!"
                            </p>
                            <h6 class="text-primary">- Pranav Sengupta</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 mb-1">
                      <div class="d-flex client-testi" name="clientsreview">
                        <img
                          src="https://mighty.tools/mockmind-api/content/human/80.jpg"
                          alt=""
                          class="rounded shadow avatar avatar-small client-image"
                          style={{ height: "65px", width: "65px" }}
                        />
                        <div class="flex-1 bg-white p-3 position-relative rounded shadow content">
                          <div
                            class="star-ratings"
                            title="5 Stars"
                            style={{
                              position: "relative",
                              boxSizing: "border-box",
                              display: "inline-block",
                            }}
                          >
                            <div
                              class="star-container"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                verticalAlign: "middle",
                                padding: "right 3px",
                                color: "rgb(241, 116, 37)",
                              }}
                            >
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                            </div>
                            <p class="text-muted mt-2">
                              " I have worked on several projects with Shakhi,
                              and I will keep working with him in the future. He
                              is very good to work with."
                            </p>
                            <h6 class="text-primary">- Robert Marshall</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 mb-1">
                      <div class="d-flex client-testi" name="clientsreview">
                        <img
                          src="https://mighty.tools/mockmind-api/content/human/99.jpg"
                          alt=""
                          class="rounded shadow avatar avatar-small client-image"
                          style={{ height: "65px", width: "65px" }}
                        />
                        <div class="flex-1 bg-white p-3 position-relative rounded shadow content">
                          <div
                            class="star-ratings"
                            title="5 Stars"
                            style={{
                              position: "relative",
                              boxSizing: "border-box",
                              display: "inline-block",
                            }}
                          >
                            <div
                              class="star-container"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                verticalAlign: "middle",
                                padding: "right 3px",
                                color: "rgb(241, 116, 37)",
                              }}
                            >
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                              <i class="bi bi-star-fill"></i>
                            </div>
                            <p class="text-muted mt-2">
                              "I recently had the pleasure of working with Wing
                              Co who did an outstanding job for us. The Wing Co
                              team was always available and their software
                              development skills are top-notch. I highly
                              recommend Wing Co to anyone in need of a skilled
                              and reliable software development powerhouse on
                              Upwork."
                            </p>
                            <h6 class="text-primary">- Patrick Johnson</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="position-relative">
        <div class="text-footer overflow-hidden shape">
          <svg
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Pricing;
