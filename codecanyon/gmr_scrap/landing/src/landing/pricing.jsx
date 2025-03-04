import check from "../img/check.png";
import pricingBanner from "../img/pricing.png";
function Pricing() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="section__area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="section__content section-title text-center">
              <h1 className="home-section__content--title">
                Affordable Pricing Plans For Everyone
              </h1>
              {/* <!-- <p className="home-section__content--subtitle">We have found 150,000,000+ leades for thousands
                            of businesses around the world this year.</p> --> */}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-sm-6">
              <div className="pricing__single">
                <h3 className="pricing__single__title">Regular License</h3>
                <div className="pricing__single__price lh-1 fw-bold">$5</div>
                <p className="pricing__single__subtitle">
                  You or one client can use it in a single end product for which
                  end users are not charged. The total price includes a buyer
                  fee and the item price.
                </p>
                <a href="" className="geo-btn geo-btn__style-two">
                  Buy Now
                </a>
                <span className="pricing__single__span">
                  Included Features:
                </span>
                <ul className="pricing__single__menu list-unstyled">
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    One Time Purchase
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    Free Lifetime access to future updates
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    6 months of support from enytime
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    quality checked by envato
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="pricing__single pricing__single__most-popular">
                <span className="pricing__single--popular-text">
                  Most Popular
                </span>
                <h3 className="pricing__single__title">Extended License</h3>
                <div className="pricing__single__price lh-1 fw-bold">$399</div>
                <p className="pricing__single__subtitle">
                  You or one client can use it in a single end product for which
                  end users are not charged. The total price includes a buyer
                  fee and the item price.
                </p>
                <a href="" className="geo-btn geo-btn__style-two">
                  Buy Now
                </a>
                <span className="pricing__single__span">
                  Included Features:
                </span>
                <ul className="pricing__single__menu list-unstyled">
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    One Time Purchase
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    Free Lifetime access to future updates
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    6 months of support from enytime
                  </li>
                  <li className="pricing__single__menu__item">
                    <img
                      src={check}
                      className="pricing__single__menu__item__img"
                      alt="check"
                    />
                    quality checked by envato
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="pricing__single h-100">
                <h3 className="pricing__single__title">Custome License</h3>
                <p className="pricing__single__subtitle">
                  If a custom License is necessary for your business model,
                  contact us to discuss it.
                </p>
                <a
                  href="mailto:example@example.com"
                  className="geo-btn geo-btn__default"
                >
                  Contact Us
                </a>
                <div className="pricing__single__img">
                  <img src={pricingBanner} alt="pricing" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
