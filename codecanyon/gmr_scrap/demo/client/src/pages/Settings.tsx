import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { getSettings } from "../services/settingService";

export const Settings = () => {
  const [currency, setCurrency] = useState("usd");
  const [costs, setCosts] = useState("0.01");
  const [language, setLanguage] = useState("en");
  const [coinSettings, setCoinSettings] = useState({
    image: 2,
    video: 3,
    response: 1,
    review: 1,
    validation: 3,
  });
  const [scrapSettings, setScrapSettings] = useState({
    minimum: 1,
    maximum: 10,
    retry: 3,
    minCpu: 2,
    minRam: 4,
    minStorage: 10,
  });

  useEffect(() => {
    getSettings().subscribe((settings) => {
      console.log(`settings`, settings);
      setCoinSettings(settings?.prices || {});
    });
  }, []);

  return (
    <Container>
      <Row className="g-3">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Tabs
                defaultActiveKey="scrapSettings"
                id="mainSettings"
                className="mb-3"
              >
                <Tab eventKey="generalSettings" title="General">
                  General settings
                </Tab>
                <Tab eventKey="coinSettings" title="Coin">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Image</Form.Label>
                          <Form.Control
                            type="number"
                            value={coinSettings.image}
                            onChange={(e) =>
                              setCoinSettings({
                                ...coinSettings,
                                image: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The cost for each image in coins.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Video</Form.Label>
                          <Form.Control
                            type="number"
                            value={coinSettings.video}
                            onChange={(e) =>
                              setCoinSettings({
                                ...coinSettings,
                                video: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The cost for each video in coins.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Response</Form.Label>
                          <Form.Control
                            type="number"
                            value={coinSettings.response}
                            onChange={(e) =>
                              setCoinSettings({
                                ...coinSettings,
                                response: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The cost for each response in coins.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Review</Form.Label>
                          <Form.Control
                            type="number"
                            value={coinSettings.review}
                            onChange={(e) =>
                              setCoinSettings({
                                ...coinSettings,
                                review: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The cost for each review in coins.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Validation</Form.Label>
                          <Form.Control
                            type="number"
                            value={coinSettings.validation}
                            onChange={(e) =>
                              setCoinSettings({
                                ...coinSettings,
                                validation: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The cost for each validation in coins.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="scrapSettings" title="Scrap">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.minimum}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                minimum: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum number of scrapes.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Maximum</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.maximum}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                maximum: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The maximum number of scrapes.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Retry</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.retry}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                retry: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The number of retries.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum CPU</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.minCpu}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                minCpu: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum CPU usage.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum RAM</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.minRam}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                minRam: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum RAM usage.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum Storage</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.minStorage}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                minStorage: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum storage usage.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
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
