import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoWhiteSrc from '../../assets/images/logo-wing-white.svg';
import logoSrc from '../../assets/images/logo-wing.svg';

const Navbar = () => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const location = useLocation();
  const isActiveProduct = location.pathname.startsWith('/products');

  const isSerPage = useMemo(
    () =>
      ['/services', '/pricing', '/single-service'].some((path) =>
        location.pathname.startsWith(path),
      ),
    [location.pathname],
  );

  useEffect(() => {
    if (!logoRef.current) return;
    logoRef.current.src = isSerPage ? logoWhiteSrc : logoSrc;
  }, [isSerPage]);

  const handleScroll = useCallback(() => {
    const navbar = navbarRef.current;
    const logo = logoRef.current;
    if (!navbar || !logo) return;

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled', 'bg-white');
      navbar.classList.remove('bg-transparent', 'ser');
      if (isSerPage) {
        logo.src = logoSrc;
      }
    } else {
      navbar.classList.remove('scrolled', 'bg-white');
      navbar.classList.add('bg-transparent');
      if (isSerPage) {
        logo.src = logoWhiteSrc;
        navbar.classList.add('ser');
      }
    }
  }, [isSerPage, logoRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav
      ref={navbarRef}
      className={`navbar navbar-expand-lg navbar-light p-0 fixed-top ${isSerPage ? 'ser' : ''}`}
    >
      <div className='container bg-transparent justify-content-between'>
        <div className='navbar w-100'>
          <Link className='d-flex navbar-brand align-items-center justify-content-center' to='/'>
            <img ref={logoRef} src={logoSrc} height='36px' alt='Scrappio' />
          </Link>
          <button
            className='navbar-toggler border-0 shadow-none geo-btn geo-btn-outline'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNavDropdown'
            aria-controls='navbarNavDropdown'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
        </div>
        <div className='collapse navbar-collapse justify-content-end'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link
                className={`nav-link ${
                  location.pathname === '/services' ||
                  location.pathname.startsWith('/single-service')
                    ? 'active'
                    : ''
                }`}
                to='/services'
              >
                Services
              </Link>
            </li>
            <li className='dropdown nav-item cursor-pointer'>
              <a
                className={`dropdown-toggle cursor-pointer nav-link ${
                  isActiveProduct ? 'active' : ''
                }`}
              >
                Products <i className='bi bi-chevron-down'></i>
              </a>
              <div className='dropdown-menu sub-menu border-0 shadow'>
                <ul className='d-flex list-unstyled gap-2'>
                  <li>
                    <ul className='d-flex flex-column list-unstyled gap-3'>
                      <li className='d-flex flex-column'>
                        <Link
                          to='/products/apify'
                          className={`nav-link ps-0 fw-bold ${
                            location.pathname === '/products/apify' ? 'active' : ''
                          }`}
                        >
                          Apify
                        </Link>
                        <span className='text-muted menu-subtitle'>
                          Effortless web scraping and automation with Apify’s powerful tools.
                        </span>
                      </li>
                      <li className='d-flex flex-column'>
                        <Link
                          to='/products/linkedin'
                          className={`nav-link ps-0 fw-bold ${
                            location.pathname === '/products/linkedin' ? 'active' : ''
                          }`}
                        >
                          LinkedIn
                        </Link>
                        <span className='text-muted menu-subtitle'>
                          Extract valuable data from LinkedIn effortlessly for insights and growth.
                        </span>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul className='d-flex flex-column list-unstyled gap-3'>
                      <li className='d-flex flex-column'>
                        <Link
                          to='/products/google'
                          className={`nav-link ps-0 fw-bold ${
                            location.pathname === '/products/google' ? 'active' : ''
                          }`}
                        >
                          Google Maps
                        </Link>
                        <span className='text-muted menu-subtitle'>
                          Collect and analyze Google Maps reviews to gain valuable customer
                          insights.
                        </span>
                      </li>
                      <li className='d-flex flex-column'>
                        <Link
                          to='/products/indeed'
                          className={`nav-link ps-0 fw-bold ${
                            location.pathname === '/products/indeed' ? 'active' : ''
                          }`}
                        >
                          Indeed
                        </Link>
                        <span className='text-muted menu-subtitle'>
                          Extract job listings and company insights from Indeed effortlessly.
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                to='/pricing'
              >
                Pricing
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                to='/contact'
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
