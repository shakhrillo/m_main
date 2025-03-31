import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
  const location = useLocation();
  const openTelegram = () => {
    const url = 'https://t.me/mukhammad';
    window.open(url, '_blank', 'noopener,noreferrer');
  };
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
                  <div class='col-12 d-flex flex-column justify-content-center align-items-center'>
                    <img src='/assets/images/telegram.png' width={'200px'} />
                    <p className='para-desc text-muted text-center mt-4'>
                      Reach out to us instantly on Telegram for quick support and seamless
                      communication.
                    </p>
                    <div class='row'>
                      <div class='col-sm-12 mt-3'>
                        <a href='https://t.me/shakhrillo' target='_blank' rel='noopener noreferrer'>
                          <button style={{ backgroundColor: '#2AABEE' }} className='btn text-white'>
                            Open Telegram
                          </button>
                        </a>
                      </div>
                    </div>
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
