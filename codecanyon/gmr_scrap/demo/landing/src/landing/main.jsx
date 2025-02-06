import globe from "../img/globe.png";
import phone from "../img/phone.png";
import review from "../img/review.png";

function Main() {
  return (
    <section id="home" className="home-section">
      <div className="section__area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="home-section__content">
                <h1 className="home-section__content--title">
                  Google Maps Review Scraper
                </h1>
                <p className="home-section__content--subtitle">
                  An excellent Google Places API alternative to easily scrape
                  data such as names, contact info, ratings, geolocation,
                  images, reviews, prices, and more from Google Maps without a
                  single line of code. You can scrape by keywords, URLs,
                  location, and even language and export the data in CSV, Excel,
                  or JSON formats.
                </p>

                <button className="geo-btn geo-btn__default">
                  Try for free
                </button>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="banner-image">
                <div className="image"></div>
                <div className="banner-image__content">
                  <span>
                    <img src={globe} alt="Globe" />
                    15M+ Emails
                  </span>
                  <span>
                    <img src={phone} alt="Phone" />
                    20M+ Phone Numbers
                  </span>
                  <span>
                    <img src={review} alt="Reviews" />
                    43M+ Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
