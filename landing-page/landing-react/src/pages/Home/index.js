import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import banner from '../../assets/images/banner-home.svg';
import data from '../../data/home-data.json';

const Home = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const starsStyle = {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'middle',
    paddingRight: '3px',
    color: 'rgb(241, 116, 37)',
  };

  return (
    <div>
      <section id='home' className='d-table bg-half-170 w-100'>
        <div className='container'>
          <div className='row align-items-center mt-5'>
            <div className='col-lg-7 col-md-7'>
              <div className='me-lg-4 title-heading'>
                <h1 className='heading mb-3'>
                  Innovative Solutions to Elevate
                  <span className='text-primary'> Your Business </span>
                </h1>
                <p className='text-muted para-desc'>
                  Empowering businesses with cutting-edge technology, creative design, and strategic
                  solutions for lasting success.
                </p>
                <div className='mt-4'>
                  <a href='/contact' className='btn btn-primary me-2 mt-2'>
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-5 col-md-5 mt-4 mt-sm-0 pt-2 pt-sm-0'>
              <img src={banner} width='100%' alt='' />
            </div>
          </div>
        </div>
      </section>
      <section className='border-bottom border-top py-4'>
        <div className='container'>
          <div className='row justify-content-center'>
            {data.technologies.map((e, index) => (
              <div key={e.alt || index} className='col-6 col-lg-2 col-md-2 text-center py-4'>
                <img src={e.src} className='avatar avatar-ex-sm' alt={e.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className='section'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col col-12 text-center'>
              <div className='mb-4 pb-2 section-title'>
                <h4 className='mb-4 title'>Services</h4>
                <p className='text-muted mb-0 mx-auto para-desc'>
                  Custom digital solutions designed to elevate your business, enhance efficiency,
                  and drive long-term success.
                </p>
              </div>
            </div>
          </div>
          <div className='row'>
            {data.services.map((e) => (
              <div className='col-lg-4 col-md-6 mt-4 pt-2' key={e.icon}>
                <Link
                  to={`/single-service/${e.title.replace(/[\s/]+/g, '-').toLowerCase()}`}
                  className='d-flex align-items-center p-3 rounded shadow text-dark feature-primary features key-feature'
                >
                  <div className='rounded-circle text-center h3 icon mb-0 me-3'>
                    <i className={'text-primary bi bi-' + (e.icon || 'star')}></i>
                  </div>
                  <div className='flex-1'>
                    <h4 className='mb-0 title'>{e.title}</h4>
                  </div>
                </Link>
              </div>
            ))}
            <div className='col-12 text-center mt-4 pt-2'>
              <a className='btn btn-primary' href='./services.html'>
                See More <i className='bi bi-arrow-right'></i>
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className='position-relative z-0'>
        <div className='text-light overflow-hidden shape'>
          <svg viewBox='0 0 2880 250' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M720 125L2160 0H2880V250H0V125H720Z' fill='currentColor'></path>
          </svg>
        </div>
      </div>
      <section className='bg-light section'>
        <div className='container position-relative z-1'>
          <div className='row align-items-center mb-4 pb-2'>
            <div className='col-md-8'>
              <div className='text-center text-md-start section-title'>
                <h4 className='mb-4'>Why Choose Us ?</h4>
                <p className='text-muted mb-0 para-desc'>
                  We prioritize reliability, flexibility, and customer satisfaction to deliver the
                  best experience.
                </p>
              </div>
            </div>
          </div>
          <div className='row'>
            {data.whyChooseUs.map((e) => (
              <div className='col-12 col-md-3 mt-5' key={e.title}>
                <div className='feature-primary features'>
                  <div className='d-inline-block position-relative image'>
                    <i className={`text-primary bi bi-${e.icon} h2`}></i>
                  </div>
                  <div className='content mt-4'>
                    <h5>{e.title}</h5>
                    <p className='text-muted mb-0'>{e.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='position-relative'>
        <div className='text-white overflow-hidden shape'>
          <svg viewBox='0 0 2880 250' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M720 125L2160 0H2880V250H0V125H720Z' fill='currentColor'></path>
          </svg>
        </div>
      </div>
      <section>
        <div className='container position-relative mt-100 mt-60 pb-5 z-1'>
          <div className='row justify-content-center'>
            <div className='col-12 text-center'>
              <div className='mb-4 pb-2 section-title'>
                <h4 className='mb-4 title'>Our Clients Said</h4>
                <p className='text-muted mb-0 mx-auto para-desc'>
                  Discover what our clients have to say about working with us — real experiences,
                  real success stories, and the impact we've made on their businesses.
                </p>
              </div>
            </div>
          </div>
          <div className='row justify-content-center'>
            <div className='col-lg-12 mt-4'>
              <div id='customer-testi' className='tiny-three-item'>
                <div className='tiny-slide'>
                  <div className='row'>
                    <div className='col-md-4 mb-1'>
                      <div className='d-flex client-testi' name='clientsreview'>
                        <img
                          src='https://mighty.tools/mockmind-api/content/human/65.jpg'
                          alt=''
                          className='rounded shadow avatar avatar-small client-image'
                          style={{ height: 65 + 'px', width: 65 + 'px' }}
                        />
                        <div className='flex-1 bg-white p-3 position-relative rounded shadow w-100 content'>
                          <div className='star-ratings position-relative d-inline-block border-box'>
                            <div className='star-container' style={starsStyle}>
                              {[...Array(5)].map((_, index) => (
                                <i key={index} className='bi bi-star-fill me-1'></i>
                              ))}
                            </div>
                            <p className='text-muted mt-2'>"Thanks a ton! Great job!"</p>
                            <h6 className='text-primary'>- Pranav Sengupta</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4 mb-1'>
                      <div className='d-flex client-testi' name='clientsreview'>
                        <img
                          src='https://mighty.tools/mockmind-api/content/human/80.jpg'
                          alt=''
                          className='rounded shadow avatar avatar-small client-image'
                          style={{ height: 65 + 'px', width: 65 + 'px' }}
                        />
                        <div className='flex-1 bg-white p-3 position-relative rounded shadow content'>
                          <div className='star-ratings position-relative d-inline-block border-box'>
                            <div className='star-container' style={starsStyle}>
                              {[...Array(5)].map((_, index) => (
                                <i key={index} className='bi bi-star-fill me-1'></i>
                              ))}
                            </div>
                            <p className='text-muted mt-2'>
                              " I have worked on several projects with Shakhi, and I will keep
                              working with him in the future. He is very good to work with."
                            </p>
                            <h6 className='text-primary'>- Robert Marshall</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4 mb-1'>
                      <div className='d-flex client-testi' name='clientsreview'>
                        <img
                          src='https://mighty.tools/mockmind-api/content/human/99.jpg'
                          alt=''
                          className='rounded shadow avatar avatar-small client-image'
                          style={{ height: 65 + 'px', width: 65 + 'px' }}
                        />
                        <div className='flex-1 bg-white p-3 position-relative rounded shadow content'>
                          <div className='star-ratings position-relative d-inline-block border-box'>
                            <div className='star-container' style={starsStyle}>
                              {[...Array(5)].map((_, index) => (
                                <i key={index} className='bi bi-star-fill me-1'></i>
                              ))}
                            </div>
                            <p className='text-muted mt-2'>
                              "I recently had the pleasure of working with Wing Co who did an
                              outstanding job for us. The Wing Co team was always available and
                              their software development skills are top-notch. I highly recommend
                              Wing Co to anyone in need of a skilled and reliable software
                              development powerhouse on Upwork."
                            </p>
                            <h6 className='text-primary'>- Patrick Johnson</h6>
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

      <div className='position-relative z-0'>
        <div className='text-light overflow-hidden shape'>
          <svg viewBox='0 0 2880 250' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M720 125L2160 0H2880V250H0V125H720Z' fill='currentColor'></path>
          </svg>
        </div>
      </div>
      <section className='bg-light border-bottom section'>
        <div className='container'>
          <div className='row'>
            {data.faq.map((e) => (
              <div className='col-12 col-md-6 mt-4' key={e.title}>
                <div className='d-flex'>
                  <span className='text-primary h5 me-2 mt-1'>
                    <i className='bi bi-question-circle'></i>
                  </span>
                  <div className='flex-1'>
                    <h5 className='mt-0'>{e.title}</h5>
                    <p className='text-muted mb-0'>{e.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='row justify-content-center my-4 my-md-5 pb-lg-4 pt-2 pt-md-3'>
            <div className='col-12 text-center'>
              <div className='section-title'>
                <h4 className='mb-4 title'>Have a Question ? Get in touch!</h4>
                <p className='text-muted mx-auto para-desc'>
                  We're here to help! Reach out to us with any questions, and our team will respond
                  as soon as possible.
                </p>
                <a className='btn btn-primary mt-4' href='./contact.html'>
                  <i className='bi bi-telephone me-2'></i>
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='position-relative'>
        <div className='text-footer overflow-hidden shape'>
          <svg viewBox='0 0 2880 250' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M720 125L2160 0H2880V250H0V125H720Z' fill='currentColor'></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Home;
