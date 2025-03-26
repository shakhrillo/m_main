import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import logoSrc from "../../assets/images/logo-wing.svg";
import logoWhiteSrc from "../../assets/images/logo-wing-white.svg";

const Navbar = () => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const location = useLocation();

  const isSerPage = useMemo(
    () => ["/services", "/pricing"].includes(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    logo.src = isSerPage ? logoWhiteSrc : logoSrc;
  }, [isSerPage]);

  const handleScroll = useCallback(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled", "bg-white");
      navbar.classList.remove("bg-transparent", "ser");
    } else {
      navbar.classList.remove("scrolled", "bg-white");
      navbar.classList.add("bg-transparent");

      if (isSerPage) {
        navbar.classList.add("ser");
      }
    }
  }, [isSerPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      ref={navbarRef}
      className={`navbar navbar-expand-lg navbar-light p-0 fixed-top ${
        isSerPage ? "ser" : ""
      }`}
    >
      <div className="container bg-transparent justify-content-between">
        <div className="navbar w-100">
          <Link
            className="d-flex navbar-brand align-items-center justify-content-center"
            to="/"
          >
            <img ref={logoRef} src={logoSrc} height="36px" alt="Scrappio" />
          </Link>
          <button
            className="navbar-toggler border-0 shadow-none geo-btn geo-btn-outline"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/services" ? "active" : ""
                }`}
                to="/services"
              >
                Services
              </Link>
            </li>
            <li className="dropdown nav-item">
              <a
                className="dropdown-toggle nav-link"
                href="#"
                data-bs-toggle="dropdown"
              >
                Products <i className="bi bi-chevron-down"></i>
              </a>
              <div className="dropdown-menu sub-menu">
                <ul className="d-flex list-unstyled gap-2">
                  <li>
                    <ul className="d-flex flex-column list-unstyled gap-3">
                      <li className="d-flex flex-column">
                        <Link to="/products-apify" className="menu-title">
                          Apify
                        </Link>
                        <span className="text-muted menu-subtitle">
                          Effortless web scraping and automation with Apify’s
                          powerful tools.
                        </span>
                      </li>
                      <li className="d-flex flex-column">
                        <Link to="/products-linkedin" className="menu-title">
                          LinkedIn
                        </Link>
                        <span className="text-muted menu-subtitle">
                          Extract valuable data from LinkedIn effortlessly for
                          insights and growth.
                        </span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul className="d-flex flex-column list-unstyled gap-3">
                      <li className="d-flex flex-column">
                        <Link to="/products-google-maps" className="menu-title">
                          Google Maps
                        </Link>
                        <span className="text-muted menu-subtitle">
                          Collect and analyze Google Maps reviews to gain
                          valuable customer insights.
                        </span>
                      </li>
                      <li className="d-flex flex-column">
                        <Link to="/products-indeed" className="menu-title">
                          Indeed
                        </Link>
                        <span className="text-muted menu-subtitle">
                          Extract job listings and company insights from Indeed
                          effortlessly.
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/pricing" ? "active" : ""
                }`}
                to="/pricing"
              >
                Pricing
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
