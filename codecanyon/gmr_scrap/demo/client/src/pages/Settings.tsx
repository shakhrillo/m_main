import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

export const Settings = () => {
  const [currency, setCurrency] = useState("usd");
  const [costs, setCosts] = useState("0.01");
  const [language, setLanguage] = useState("en");

  return (
    <Container>
      <Row>
        <Col>
          <div className="card">
            <div className="card-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="row mb-3 justify-content-center align-items-center">
                  <Col>
                    <label htmlFor="currency" className="form-label">
                      Currency
                    </label>
                    <div className="row">
                      <div
                        className="btn-group w-auto"
                        role="group"
                        aria-label="Default button group"
                      >
                        <button
                          type="button"
                          onClick={() => setCurrency("all")}
                          className={`btn btn-outline-primary ${currency === "usd" && "active"}`}
                        >
                          USD
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("completed")}
                          className={`btn btn-outline-primary ${currency === "eur" && "active"}`}
                        >
                          EUR
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("pending")}
                          className={`btn btn-outline-primary ${currency === "cad" && "active"}`}
                        >
                          CAD
                        </button>
                      </div>
                    </div>
                    <span className="form-text">Select your currency</span>
                  </Col>
                  <Col>
                    <div className="mb-3">
                      <label htmlFor="coin" className="form-label">
                        1 coin costs in {currency}
                      </label>
                      <input
                        type="text"
                        name="coin"
                        id="coin"
                        className="form-control"
                        placeholder="0.01"
                        value={costs}
                        onChange={(e) => setCosts(e.target.value)}
                      />
                      <a
                        href="https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts"
                        className="form-text"
                      >
                        Learn more about minimum charge
                      </a>
                    </div>
                  </Col>
                </div>
                <div className="mb-3 col-6">
                  <label htmlFor="language" className="form-label">
                    Language
                  </label>
                  <select
                    name="language"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="form-select"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
