import logo from "../img/logo-with-text.svg";

function Navbar() {
  return (
    <nav className="geo-navbar">
      <div className="container">
        <div className="geo-navbar__content">
          <a className="geo-navbar__brand" href="#home">
            <img src={logo} alt="GeoScrapper" />
          </a>
          <ul className="geo-navbar__content--menu">
            <li className="geo-navbar__content--menu__item">
              <a href="#canGet">Data We Provide</a>
            </li>
            <li className="geo-navbar__content--menu__item">
              <a href="#testimonial">Testimonial</a>
            </li>
            <li className="geo-navbar__content--menu__item">
              <a href="#documentation">Documentation</a>
            </li>
            <li className="geo-navbar__content--menu__item">
              <a href="#integration">Integration</a>
            </li>
            <li className="geo-navbar__content--menu__item">
              <a href="#pricing">Pricing</a>
            </li>
            <li className="geo-navbar__content--menu__item">
              <a href="#faq">FAQ</a>
            </li>
          </ul>
          <button className="geo-btn geo-btn__style-two">
            Start a free trial
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
