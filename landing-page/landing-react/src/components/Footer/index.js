import logoWhiteSrc from "../../assets/images/logo-wing-white.svg";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <div className="footer-py-60">
              <div className="row">
                <div className="col-12 col-lg-4 mb-0 mb-md-4 pb-0 pb-md-2">
                  <a className="logo-footer" href="">
                    <img src={logoWhiteSrc} height="36" alt="Scrappio" />
                  </a>
                  <p className="mt-4">
                    Scrappio helps you effortlessly collect, organize, and
                    analyze data from multiple online sources, turning raw
                    information into valuable business insights.
                  </p>
                  <ul className="list-unstyled foot-social-icon mb-0 mt-4 social-icon">
                    <li className="list-inline-item me-1">
                      <a className="rounded" href="">
                        <i className="bi bi-instagram"></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-1">
                      <a className="rounded" href="">
                        <i className="bi bi-twitter-x"></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-1">
                      <a className="rounded" href="">
                        <i className="bi bi-whatsapp"></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-1">
                      <a className="rounded" href="">
                        <i className="bi bi-github"></i>
                      </a>
                    </li>
                    <li className="list-inline-item me-1">
                      <a className="rounded" href="">
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
