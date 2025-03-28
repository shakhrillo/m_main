import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import creativeBg from '../../assets/images/creative.jpg';
import bgImage from '../../assets/images/service-bg-2.jpg';
import data from '../../data/services-data.json';

const Services = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <section
        className='d-table bg-half-170 bg-light w-100'
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      >
        <div className='bg-overlay'></div>
        <div className='container'>
          <div className='row justify-content-center mt-5'>
            <div className='col-lg-12 text-center'>
              <div className='pages-heading title-heading'>
                <h2 className='text-white title-dark'>{data.heading.title}</h2>
                <p className='text-white-50 mb-0 mx-auto para-desc'>{data.heading.subtitle}</p>
              </div>
            </div>
          </div>
          <div className='position-breadcrumb'>
            <nav aria-label='breadcrumb' className='d-inline-block bg-white'></nav>
          </div>
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
      <section className='section'>
        <div className='container'>
          <div className='row align-items-center'>
            {data.services.map((e) => (
              <div className='col-lg-3 col-md-6 mt-4 pt-2'>
                <div className='card border-0 p-4 shadow course-feature feature-clean features overflow-hidden'>
                  <div className='rounded text-center text-primary icons'>
                    <i className={`bi bi-${e.icon} h3 mb-0`}></i>
                  </div>
                  <div className='card-body p-0 mt-4'>
                    <a className='text-dark h5 title'>{e.title}</a>
                    <p className='text-muted mt-2'>{e.subtitle}</p>
                    <Link
                      to={`/single-service/${e.title.replace(/[\s/]+/g, '-').toLowerCase()}`}
                      className='position-relative text-primary read-more z-1'
                      href=''
                    >
                      Read More
                      <i className='bi bi-chevron-right fw-bolder small'></i>
                    </Link>
                    <i className={`text-primary bi bi-${e.icon} full-img uil`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='container mt-100 mt-60'>
            <div className='row justify-content-center'></div>
            <div className='col-12'>
              <div className='text-center mb-4 pb-4 section-title'>
                <h6 className='text-primary'>{data.workProceess['pre-title']}</h6>
                <h4 className='mb-4 title'>{data.workProceess.title}</h4>
                <p className='text-muted mb-0 mx-auto para-desc'>{data.workProceess.subtitle}</p>
              </div>
            </div>
            <div className='row'>
              {data.workProceess.options.map((e, id) => (
                <div
                  className={`col-md-4 mt-4 ${id ? `mt-md-5 pt-md-${3 + id}` : ''} pt-2 pt-md-3`}
                >
                  <div
                    className={`card bg-transparent border-0 text-center feature-clean feature-primary features ${
                      id !== 2 ? 'process-arrow work-process' : ''
                    }`}
                  >
                    <div className='rounded text-center icons mx-auto'>
                      <i className={`text-primary bi bi-${e.icon} h3 mb-0`}></i>
                    </div>
                    <div className='card-body'>
                      <h5 className='text-dark'>{e.title}</h5>
                      <p className='text-muted mb-0'>{e.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='container-fluid mt-100 mt-60'>
          <div
            className='card bg-cta rounded shadow overflow-hidden'
            style={{
              backgroundImage: `url(${creativeBg})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          >
            <div className='bg-overlay z-0'></div>
            <div className='container'>
              <div className='row justify-content-center'>
                <div className='col-12 text-center'>
                  <div className='position-relative section-title z-1'>
                    <h4 className='text-white mb-4 title title-dark'>{data.videoBanner.title}</h4>
                    <p className='text-white-50 mx-auto para-dark para-desc'>
                      {data.videoBanner.subtitle}
                    </p>
                    <a className='border border-light mt-4 play-btn video-play-icon' href=''>
                      <i className='text-light bi bi-play'></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='container mt-100 mt-60'>
          <div className='row align-items-end mb-4 pb-4'>
            <div className='col-md-12'>
              <div className='text-center text-md-start section-title'>
                <h6 className='text-primary'>{data.whatWeDo['pre-title']}</h6>
                <h4 className='mb-4 title'>{data.whatWeDo.title}</h4>
                <p className='text-muted mb-0 para-desc'>{data.whatWeDo.subtitle}</p>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-4 mt-4 pt-2'>
              <ul
                id='pills-tab'
                role='tablist'
                className='flex-column nav nav-justified nav-pills p-3 rounded shadow mb-0 sticky-bar'
              >
                {data.whatWeDo.leftMenu.map((e, id) => (
                  <li className={`nav-item ${id ? 'mt-2' : ''}`}>
                    <a
                      className={`nav-link rounded ${!id ? 'active' : ''}`}
                      id={`pills-${e.control}-tab`}
                      data-bs-toggle='pill'
                      data-bs-target={`#pills-${e.control}`}
                      type='button'
                      role='tab'
                      aria-controls={`pills-${e.control}`}
                      aria-selected='true'
                    >
                      <div className='p-1 text-center'>
                        <h6 className='mb-0'>{e.title}</h6>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='col-12 col-md-8 mt-4 pt-2'>
              <div className='tab-content' id='v-pills-tabContent'>
                {data.whatWeDo.tabOptions.map((e, id) => (
                  <div
                    className={`fade ${!id ? 'active show' : ''}  tab-pane`}
                    id={`pills-${data.whatWeDo.leftMenu[id].control}`}
                    role='tabpanel'
                    aria-labelledby={`pills-${data.whatWeDo.leftMenu[id].control}-tab`}
                  >
                    <div className='table-responsive bg-white rounded shadow'>
                      <table className='table table-center mb-0'>
                        <thead>
                          <tr>
                            {data.whatWeDo.tabHeader.map((e) => (
                              <th scope='col' className='border-bottom p-3'>
                                {e}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {e.map((i) => (
                            <tr>
                              <td className='p-3 text-start'>
                                <p className='text-primary fw-bold mb-0'>{i.title}</p>
                              </td>
                              <td className='p-3 small'>
                                <p className='forum-price mb-0'>{i.subtitle}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

export default Services;
