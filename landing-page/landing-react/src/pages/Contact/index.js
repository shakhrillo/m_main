import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <section class='d-table bg-half-170 bg-light w-100'>
        <div class='container'>
          <div class='row justify-content-center mt-5'>
            <div class='col-lg-12 text-center'>
              <h3 class='fw-bold mb-0'>Submit your Support Request</h3>
            </div>
          </div>
          <div class='position-breadcrumb'>
            <nav aria-label='breadcrumb' class='d-inline-block bg-white'></nav>
          </div>
        </div>
      </section>
      <div class='position-relative'>
        <div class='text-white overflow-hidden shape'>
          <svg viewBox='0 0 2880 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z'
              fill='currentColor'
            ></path>
          </svg>
        </div>
      </div>

      <section class='section'>
        <div class='container'>
          <div class='row justify-content-center'>
            <div class='col-12 col-lg-7'>
              <div class='p-4 rounded shadow'>
                <div class='row'>
                  <div class='col-12'>
                    <form action=''>
                      <div class='row'>
                        <div class='col-md-6'>
                          <div class='mb-3'>
                            <label class='form-label' for='name'>
                              Your name
                              <span class='text-danger'>*</span>
                            </label>
                            <div class='form-icon position-relative'>
                              <i class='bi bi-person'></i>
                              <input
                                type='text'
                                class='form-control ps-5'
                                placeholder='First Name :'
                                name='name'
                              />
                            </div>
                          </div>
                        </div>
                        <div class='col-md-6'>
                          <div class='mb-3'>
                            <label class='form-label' for='email'>
                              Your email
                              <span class='text-danger'>*</span>
                            </label>
                            <div class='form-icon position-relative'>
                              <i class='bi bi-envelope'></i>
                              <input
                                type='email'
                                class='form-control ps-5'
                                placeholder='Your email :'
                                name='email'
                              />
                            </div>
                          </div>
                        </div>
                        <div class='col-md-12'>
                          <div class='mb-3'>
                            <label class='form-label' for='subject'>
                              Subject
                            </label>
                            <div class='form-icon position-relative'>
                              <i class='bi bi-book'></i>
                              <input
                                type='text'
                                class='form-control ps-5'
                                placeholder='Your subject : '
                                name='subject'
                              />
                            </div>
                          </div>
                        </div>
                        <div class='col-md-12'>
                          <div class='mb-3'>
                            <label class='form-label' for='subject'>
                              Comments
                            </label>
                            <div class='form-icon position-relative'>
                              <i class='bi bi-chat'></i>
                              <textarea
                                type='text'
                                class='form-control ps-5'
                                placeholder='Your Message : '
                                name='subject'
                                rows='3'
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class='row'>
                        <div class='col-sm-12'>
                          <input
                            type='submit'
                            name='submit'
                            class='btn btn-primary'
                            value='Send Request'
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class='position-relative'>
        <div class='text-footer overflow-hidden shape'>
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
}

export default Contact;
