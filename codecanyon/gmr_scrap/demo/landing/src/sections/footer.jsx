function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            <p>
              {" "}
              ©{" "}
              <b>
                <a href="#home">GeoScrapper</a>
              </b>
              , All rights reserved.
            </p>
          </div>
          <div className="col-lg-6 col-md-6">
            <ul className="ps-0 list-unstyled fw-medium mb-0 text-md-end">
              <li className="d-inline-block">
                <a href="mailto:example@example.com">Contact Us</a>
              </li>
              <li className="d-inline-block">
                <a href="#pricing">See Pricing</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
