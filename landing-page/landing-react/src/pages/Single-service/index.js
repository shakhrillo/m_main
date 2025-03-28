import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import data from '../../data/single-service.json';

const SingleService = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const selectedData = useMemo(() => {
    const pathsMap = {
      'web-development': 'web',
      'mobile-app-development': 'mobile',
      'ui-ux-design': 'ui-ux',
      'seo-&-digital-marketing': 'seo',
      'cloud-&-devops': 'cloud',
      'it-consulting': 'consulting',
      'e-commerce-solutions': 'e-commerce',
      'software-maintenance': 'software',
    };

    const pathSegment = location.pathname.split('/').filter(Boolean).pop();
    const result = data[pathsMap[pathSegment]] || {};
    return result[0];
  }, [location.pathname]);

  return (
    <>
      <section
        className='d-table bg-half-170 bg-light w-100'
        style={{
          backgroundImage: "url('/assets/images/web-development.jpg')",
          backgroundPosition: 'center bottom',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-overlay'></div>
        <div className='container'>
          <div className='row justify-content-center mt-5'>
            <div className='col-lg-12 text-center'>
              <div className='pages-heading title-heading'>
                <h2 className='text-white title-dark'>{selectedData.title}</h2>
                <p className='text-white-50 mb-0 mx-auto para-desc'>{selectedData.subtitle}</p>
              </div>
            </div>
          </div>
          {/* <div className='position-breadcrumb'>
            <nav aria-label='breadcrumb' className='d-inline-block bg-white rounded shadow'>
              <ul className={'rounded shadow breadcrumb mb-0 px-4 py-2'}>
                {breadcrumbData.services.map((e) => (
                  <li className={'breadcrumb-item active text-primary fw-bold'}>
                    <a className={'text-primary fw-bold'}>{e.title}</a>
                    <i className={'bi bi-chevron-right fw-bolder small'}></i>
                  </li>
                ))}
              </ul>
            </nav>
          </div> */}
        </div>
      </section>
      <div className='position-relative'>
        <div className='text-white overflow-hidden shape'>
          <svg viewBox='0 0 2880 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z'
              fill='currentColor'
            ></path>
          </svg>
        </div>
      </div>
      <div className='position-relative'>
        <div className='text-white overflow-hidden shape'>
          <svg viewBox='0 0 2880 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z'
              fill='currentColor'
            ></path>
          </svg>
        </div>
      </div>
      <section>
        <div className='container mb-5 mt-100 mt-60'>
          <div className='row justify-content-center'>
            <div className='col col-12'>
              <div className='text-center mb-4 pb-2 section-title'>
                <h6 className='text-primary'>Pricing Plans</h6>
                <h4 className='mb-4 title'>Choose the Perfect Plan</h4>
                <p className='text-muted mb-0 mx-auto para-desc'>
                  We offer tailored solutions to meet your needs, whether you’re just starting out
                  or scaling your business.
                </p>
              </div>
            </div>
          </div>
          <div className='row'>
            {selectedData.pricing?.map((e) => (
              <div className='col-12 col-lg-4 col-md-6 mt-4 pt-2' key={e.title || e.id}>
                <div
                  className={`card ${
                    e.isBest ? 'bg-white' : 'bg-light'
                  } border-0 rounded shadow business-rate pricing pricing-primary sin-ser-card`}
                >
                  {e.isBest && (
                    <div className='overflow-hidden ribbon ribbon-right ribbon-warning'>
                      <span className='d-block shadow text-center h6 small'> Best </span>
                    </div>
                  )}
                  <div className='card-body'>
                    <h6 className='text-primary text-uppercase fw-bold name title'>{e.title}</h6>
                    <p className='text-muted mb-4 small'>{e.subtitle}</p>
                    <div className='d-flex mb-4'>
                      <span className='h4 mb-0 mt-2'>$</span>
                      <span className='h1 mb-0 price'>{e.price}</span>
                      <span className='align-self-end h4 mb-1'>/mo</span>
                    </div>
                    <ul className='list-unstyled mb-0 ps-0'>
                      {e.options.map((o, index) => (
                        <li className='text-muted h6 mb-3' key={index}>
                          <span className='h5 icon me-2'>
                            <i className='text-primary bi bi-check-circle'></i>
                          </span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='bg-light section'>
        <div className='container'>
          <div className='row justify-content-center my-4 my-md-5'>
            <div className='col-12 text-center'>
              <div className='section-title'>
                <h4 className='mb-4 title'>Need a Custom Solution?</h4>
                <p className='text-muted mx-auto para-desc'>
                  Not sure which plan fits your needs? We can create a tailored solution just for
                  you!
                </p>
                <Link className='btn btn-primary mt-4' to={'/contact'}>
                  <i className='bi bi-telephone me-2'></i>
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col col-12'>
              <div className='text-center mb-4 pb-2 section-title'>
                <h4 className='mb-4 title'>Why Choose Our Service ?</h4>
                <h5 className='text-muted mb-0 mx-auto para-desc'>
                  Delivering exceptional quality, reliability, and innovation to help your business
                  thrive.
                </h5>
              </div>
            </div>
          </div>
          <div className='row justify-content-center'>
            {selectedData.whyChoose?.map((e) => (
              <div className='col-lg-4 col-md-6 mt-4 pt-2' key={e.title}>
                <div className='card border-0 p-4 shadow text-center course-feature feature-clean features overflow-hidden'>
                  <div className='rounded text-center text-primary icons mx-auto'>
                    <i className={`bi bi-${e.icon} h3 mb-0`}></i>
                  </div>
                  <div className='card-body p-0 mt-4'>
                    <h5 className='text-dark h5 title'>{e.title}</h5>
                    <p className='text-muted mt-2'>{e.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='position-relative'>
        <div className='text-footer overflow-hidden shape'>
          <svg viewBox='0 0 2880 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z'
              fill='currentColor'
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default SingleService;
