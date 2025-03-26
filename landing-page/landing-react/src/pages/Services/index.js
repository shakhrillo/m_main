import bgImage from "../../assets/images/service-bg-2.jpg";
import creativeBg from "../../assets/images/creative.jpg";

const Services = () => {
  return (
    <>
      <section
        className="d-table bg-half-170 bg-light w-100"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      >
        <div className="bg-overlay"></div>
        <div className="container">
          <div className="row justify-content-center mt-5">
            <div className="col-lg-12 text-center">
              <div className="pages-heading title-heading">
                <h2 className="text-white title-dark">Services</h2>
                <p className="text-white-50 mb-0 mx-auto para-desc">
                  Comprehensive solutions to elevate your business with
                  cutting-edge technology and expert services.
                </p>
              </div>
            </div>
          </div>
          <div className="position-breadcrumb">
            <nav
              aria-label="breadcrumb"
              className="d-inline-block bg-white"
            ></nav>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="text-white overflow-hidden shape">
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
      <div className="position-relative">
        <div className="text-white overflow-hidden shape">
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
      <section className="section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-laptop h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    Web Development
                  </a>
                  <p className="text-muted mt-2">
                    Custom websites and web applications built for performance
                    and scalability.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href="./single-service.html"
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-laptop full-img uil z-0"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-lg-0 pt-2 pt-lg-0">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-phone h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    Mobile App Development
                  </a>
                  <p className="text-muted mt-2">
                    Cross-platform mobile apps with seamless user experiences.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-phone full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-lg-0 pt-2 pt-lg-0">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-palette h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    {" "}
                    UI/UX Design{" "}
                  </a>
                  <p className="text-muted mt-2">
                    Modern and user-friendly designs that enhance engagement.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-palette full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-lg-0 pt-2 pt-lg-0">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-graph-up h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    SEO & Digital Marketing
                  </a>
                  <p className="text-muted mt-2">
                    Optimize visibility and grow your business with strategic
                    marketing.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-graph-up full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-4 pt-2">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-cloud h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    Cloud & DevOps
                  </a>
                  <p className="text-muted mt-2">
                    Scalable cloud solutions and DevOps automation for
                    efficiency.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-cloud full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-4 pt-2">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-gear h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    {" "}
                    IT Consulting{" "}
                  </a>
                  <p className="text-muted mt-2">
                    Expert guidance to improve technology and business
                    processes.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-gear full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-4 pt-2">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-cart h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    E-Commerce Solutions{" "}
                  </a>
                  <p className="text-muted mt-2">
                    Custom online stores with secure payment and seamless
                    shopping experiences.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-cart full-img uil"></i>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mt-4 pt-2">
              <div className="card border-0 p-4 shadow course-feature feature-clean features overflow-hidden">
                <div className="rounded text-center text-primary icons">
                  <i className="bi bi-tools h3 mb-0"></i>
                </div>
                <div className="card-body p-0 mt-4">
                  <a className="text-dark h5 title" href="">
                    Software Maintenance
                  </a>
                  <p className="text-muted mt-2">
                    Continuous updates, bug fixes, and performance improvements.
                  </p>
                  <a
                    className="position-relative text-primary read-more z-1"
                    href=""
                  >
                    Read More
                    <i className="bi bi-chevron-right fw-bolder small"></i>
                  </a>
                  <i className="text-primary bi bi-tools full-img uil"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-100 mt-60">
            <div className="row justify-content-center"></div>
            <div className="col-12">
              <div className="text-center mb-4 pb-4 section-title">
                <h6 className="text-primary">Work Process</h6>
                <h4 className="mb-4 title">How do we works ?</h4>
                <p className="text-muted mb-0 mx-auto para-desc">
                  Our streamlined process ensures efficiency, quality, and
                  seamless execution from start to finish.
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mt-4 pt-2">
                <div className="card bg-transparent border-0 text-center feature-clean feature-primary features process-arrow work-process">
                  <div className="rounded text-center icons mx-auto">
                    <i className="text-primary bi bi-lightbulb h3 mb-0"></i>
                  </div>
                  <div className="card-body">
                    <h5 className="text-dark">Discovery & Strategy</h5>
                    <p className="text-muted mb-0">
                      We begin by understanding your goals and crafting a
                      strategic plan tailored to your needs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-4 mt-md-5 pt-2 pt-md-3">
                <div className="card bg-transparent border-0 text-center feature-clean feature-primary features process-arrow work-process">
                  <div className="rounded text-center icons mx-auto">
                    <i className="text-primary bi bi-code-slash h3 mb-0"></i>
                  </div>
                  <div className="card-body">
                    <h5 className="text-dark">Development & Execution</h5>
                    <p className="text-muted mb-0">
                      Our team designs, builds, and implements high-quality
                      solutions with seamless integration.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mt-4 mt-md-5 pt-2 pt-md-5">
                <div className="card bg-transparent border-0 text-center feature-clean feature-primary features work-process">
                  <div className="rounded text-center icons mx-auto">
                    <i className="text-primary bi bi-rocket h3 mb-0"></i>
                  </div>
                  <div className="card-body">
                    <h5 className="text-dark">Launch & Support</h5>
                    <p className="text-muted mb-0">
                      We deploy your project, ensure everything runs smoothly,
                      and provide continuous support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-100 mt-60">
          <div
            className="card bg-cta rounded shadow overflow-hidden"
            style={{
              backgroundImage: `url(${creativeBg})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <div className="bg-overlay z-0"></div>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 text-center">
                  <div className="position-relative section-title z-1">
                    <h4 className="text-white mb-4 title title-dark">
                      Empowering Your Business with Expert Solutions
                    </h4>
                    <p className="text-white-50 mx-auto para-dark para-desc">
                      We provide innovative strategies, cutting-edge technology,
                      and expert guidance to help your business grow, optimize
                      operations, and stay ahead in a competitive market.
                    </p>
                    <a
                      className="border border-light mt-4 play-btn video-play-icon"
                      href=""
                    >
                      <i className="text-light bi bi-play"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-100 mt-60">
          <div className="row align-items-end mb-4 pb-4">
            <div className="col-md-12">
              <div className="text-center text-md-start section-title">
                <h6 className="text-primary">Services</h6>
                <h4 className="mb-4 title">What we do ?</h4>
                <p className="text-muted mb-0 para-desc">
                  We deliver tailored digital solutions, from web and mobile
                  development to design, marketing, and IT consulting, to help
                  your business thrive.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mt-4 pt-2">
              <ul
                id="pills-tab"
                role="tablist"
                className="flex-column nav nav-justified nav-pills p-3 rounded shadow mb-0 sticky-bar"
              >
                <li className="nav-item">
                  <a
                    className="nav-link rounded active"
                    id="pills-developing-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-developing"
                    type="button"
                    role="tab"
                    aria-controls="pills-developing"
                    aria-selected="true"
                  >
                    <div className="p-1 text-center">
                      <h6 className="mb-0">Web developing</h6>
                    </div>
                  </a>
                </li>
                <li className="nav-item mt-2">
                  <a
                    className="nav-link rounded"
                    id="pills-design-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-design"
                    type="button"
                    role="tab"
                    aria-controls="pills-design"
                    aria-selected="false"
                  >
                    <div className="p-1 text-center">
                      <h6 className="mb-0">Design</h6>
                    </div>
                  </a>
                </li>
                <li className="nav-item mt-2">
                  <a
                    className="nav-link rounded"
                    id="pills-marketing-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-marketing"
                    type="button"
                    role="tab"
                    aria-controls="pills-marketing"
                    aria-selected="false"
                  >
                    <div className="p-1 text-center">
                      <h6 className="mb-0">Marketing</h6>
                    </div>
                  </a>
                </li>
                <li className="nav-item mt-2">
                  <a
                    className="nav-link rounded"
                    id="pills-consulting-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-consulting"
                    type="button"
                    role="tab"
                    aria-controls="pills-consulting"
                    aria-selected="false"
                  >
                    <div className="p-1 text-center">
                      <h6 className="mb-0">Consulting</h6>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-8 mt-4 pt-2">
              <div className="tab-content" id="v-pills-tabContent">
                <div
                  className="active fade show tab-pane"
                  id="pills-developing"
                  role="tabpanel"
                  aria-labelledby="pills-developing-tab"
                >
                  <div className="table-responsive bg-white rounded shadow">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="border-bottom p-3">
                            Category
                          </th>
                          <th scope="col" className="border-bottom p-3">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Overview
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              We build high-performance web and mobile
                              applications tailored to your needs.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Technologies Used
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              HTML, CSS, JavaScript, React, Vue, Flutter, Dart,
                              Next.js, Node.js, Firebase.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Key Features
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Scalable architecture, responsive design, high
                              security, and seamless UX.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Industries Served
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              E-commerce, Fintech, Healthcare, Education,
                              Travel, and more.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Development Process
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Planning → UI/UX Design → Development → Testing →
                              Deployment → Maintenance.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Why Choose Us?
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Experienced team, modern tech stack, agile
                              methodology, and continuous support.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="fade tab-pane"
                  id="pills-design"
                  role="tabpanel"
                  aria-labelledby="pills-design-tab"
                >
                  <div className="table-responsive bg-white rounded shadow">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="border-bottom p-3">
                            Category
                          </th>
                          <th scope="col" className="border-bottom p-3">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Overview
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              We create modern, intuitive, and visually
                              appealing designs to enhance user experience.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Technologies Used
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Figma, Adobe XD, Sketch, Photoshop, Illustrator.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Key Features
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              UX research, wireframing, prototyping, responsive
                              design, and design systems.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Industries Served
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              E-commerce, Fintech, Healthcare, Education,
                              Travel, and more.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Design Process
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Research → Wireframing → Prototyping → UI Design →
                              Testing → Finalization.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Why Choose Us?
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              User-centric approach, pixel-perfect designs, and
                              seamless brand consistency.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="fade tab-pane"
                  id="pills-marketing"
                  role="tabpanel"
                  aria-labelledby="pills-marketing-tab"
                >
                  <div className="table-responsive bg-white rounded shadow">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="border-bottom p-3">
                            Category
                          </th>
                          <th scope="col" className="border-bottom p-3">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Overview
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              We help businesses grow by increasing online
                              visibility, driving traffic, and optimizing
                              conversions.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Technologies Used
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Google Analytics, Google Ads, Meta Ads, Ahrefs,
                              SEMrush, Mailchimp.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Key Features
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              SEO, PPC advertising, social media marketing,
                              email campaigns, and content marketing.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Industries Served
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              E-commerce, Fintech, Healthcare, Education,
                              Travel, and more.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Marketing Process
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Research → Strategy Planning → Execution →
                              Optimization → Reporting.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Why Choose Us?
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Data-driven strategies, targeted campaigns, and
                              measurable results.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  className="fade tab-pane"
                  id="pills-consulting"
                  role="tabpanel"
                  aria-labelledby="pills-consulting-tab"
                >
                  <div className="table-responsive bg-white rounded shadow">
                    <table className="table table-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="border-bottom p-3">
                            Category
                          </th>
                          <th scope="col" className="border-bottom p-3">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Overview
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              We provide expert guidance to optimize technology,
                              business strategies, and digital transformation.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Technologies Used
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Cloud Solutions, DevOps, AI & Machine Learning,
                              Business Intelligence, Cybersecurity.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Key Features
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              IT strategy, process automation, digital
                              transformation, risk assessment, and scalability
                              planning.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Industries Served
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              E-commerce, Fintech, Healthcare, Education,
                              Logistics, and more.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Consulting Process
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Analysis → Strategy Development → Implementation →
                              Optimization → Continuous Support.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-start">
                            <p className="text-primary fw-bold mb-0">
                              Why Choose Us?
                            </p>
                          </td>
                          <td className="p-3 small">
                            <p className="forum-price mb-0">
                              Deep industry expertise, innovative solutions, and
                              a results-driven approach.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="position-relative">
        <div className="text-footer overflow-hidden shape">
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

export default Services;
