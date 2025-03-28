import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import productsData from '../../data/products-data.json';

const Products = () => {
  const { source } = useParams();

  const location = useLocation();
  const breadcrumbClicked = useRef(false);

  const tableHeader = ['Plan', 'Basic', 'Standard', 'Premium', 'Enterprice'];

  const breadcrumbs = [
    { title: 'linkedin', href: 'linkedin' },
    { title: 'apify', href: 'apify' },
    { title: 'google-maps', href: 'google' },
    { title: 'indeed', href: 'indeed' },
  ];

  const selectedData = productsData[source] || [];

  useEffect(() => {
    if (!breadcrumbClicked.current) {
      window.scrollTo(0, 0);
    }
    breadcrumbClicked.current = false;
  }, [location]);

  return (
    <>
      <section className='d-table bg-half-170 bg-light w-100'>
        <div className='container'>
          <div className='row justify-content-center mt-5'>
            <div className='col-lg-12 text-center'>
              <h3 className='fw-bold mb-0'>Seamless Web Scraping with Apify</h3>
            </div>
          </div>
          <div className='position-breadcrumb'>
            <nav
              aria-label='breadcrumb'
              className='d-inline-block bg-white'
              onClick={() => (breadcrumbClicked.current = true)}
            >
              <ul className='rounded shadow breadcrumb mb-0 px-4 py-2'>
                {breadcrumbs.map((item, index) => (
                  <li
                    key={item.href}
                    className={`breadcrumb-item ${
                      source === item.href ? 'active text-primary fw-bold' : ''
                    }`}
                  >
                    <Link
                      to={`/products/${item.href}`}
                      className={source === item.href ? 'text-primary fw-bold' : ''}
                    >
                      {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                      <i className='bi bi-chevron-right fw-bolder small'></i>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
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
          <div className='row'>
            <div className='col-lg-8'>
              <div className='table-responsive bg-white rounded shadow'>
                <table className='table table-center mb-0 overflow-hidden'>
                  <thead>
                    <tr>
                      {tableHeader.map((e) => (
                        <th scope='col' className='border-bottom p-3'>
                          {e}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody key={source}>
                    {selectedData.map((e, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: index * 0.1 }}
                      >
                        <td className='p-3 text-start'>
                          <p className='text-primary fw-bold mb-0'>{e.title}</p>
                        </td>
                        {['basic', 'standard', 'premium', 'enterprise'].map((type) => (
                          <td key={type} className='p-3 text-center small'>
                            <p
                              className={`${
                                e.title === 'Price' ? 'forum-price' : 'table-text'
                              } mb-0`}
                            >
                              {typeof e[type] === 'boolean' ? (e[type] ? '✅' : '❌') : e[type]}
                            </p>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='col-lg-4 mt-4 mt-lg-0 pt-2 pt-lg-0'>
              <div className='card bg-light border-0 rounded shadow sidebar sticky-bar'>
                <div className='card-body'>
                  <div className='mb-4 pb-2 widget'>
                    <h5 className='widget-title'>Contact us</h5>
                    <form className='login-form mt-4' action='login-form'>
                      <div className='row'>
                        <div className='col-lg-12'>
                          <div className='mb-3'>
                            <label className='form-label' for='email'>
                              Your email
                              <span className='text-danger'>*</span>
                            </label>
                            <div className='form-icon position-relative'>
                              <i className='bi bi-envelope'></i>
                              <input
                                type='email'
                                className='form-control ps-5'
                                placeholder='Email'
                                name='email'
                              />
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-12'>
                          <div className='mb-3'>
                            <label className='form-label' for='textarea'>
                              Text
                              <span className='text-danger'>*</span>
                            </label>
                            <div className='form-icon position-relative'>
                              <textarea
                                type='text'
                                className='form-control'
                                placeholder='Text'
                                name='textarea'
                                rows='3'
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-12 mb-0'>
                          <div className='d-grid'>
                            <button className='btn btn-primary'>Send</button>
                          </div>
                        </div>
                        <div className='col-12 text-center'>
                          <p className='mb-0 mt-4'>
                            <small className='text-dark me-2'>
                              If you send a message, we will get back to you.
                            </small>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className='mb-4 pb-2 widget'>
                    <h5 className='widget-title'>Contact with</h5>
                    <ul className='list-unstyled mb-0 mt-4'>
                      <li className='text-muted h6'>
                        <i className='bi bi-person'></i>
                        <a className='text-dark ms-2' href='#'>
                          Jhon
                        </a>
                        {' on '}
                        <a className='text-primary' href='#'>
                          Privacy policy
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='widget'>
                    <h5 className='widget-title'>Follow us</h5>
                    <ul className='list-unstyled mb-0 mt-4 social social-icon'>
                      <li className='list-inline-item'>
                        <a href='' className='rounded'>
                          <i className='bi bi-instagram'></i>
                        </a>
                      </li>
                      <li className='list-inline-item'>
                        <a href='' className='rounded'>
                          <i className='bi bi-facebook'></i>
                        </a>
                      </li>
                      <li className='list-inline-item'>
                        <a href='' className='rounded'>
                          <i className='bi bi-twitter'></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
