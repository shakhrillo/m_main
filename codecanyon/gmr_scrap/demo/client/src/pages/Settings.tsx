import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { getSettings } from "../services/settingService";
import { IconAdjustmentsDollar, IconEyeDollar } from "@tabler/icons-react";
import { SettingsFormInput } from "../components/SettingsFormInput";

export const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    logo: "",
    newUserBonus: 100,
  });
  const [coinSettings, setCoinSettings] = useState({
    cost: 0.02,
    image: 2,
    video: 3,
    response: 1,
    review: 1,
    validation: 3,
  });
  const [scrapSettings, setScrapSettings] = useState({
    minimum: 1,
    maximum: 10,
    maxRetries: 50,
  });
  const [dockerSettings, setDockerSettings] = useState({
    minCpu: 2,
    minRam: 4,
    minStorage: 10,
  });
  const [stripeSettings, setStripeSettings] = useState({
    secret: "",
    webhook: "",
  });

  // useEffect(() => {
  //   getSettings().subscribe((settings) => {
  //     console.log(`settings`, settings);
  //     setCoinSettings(settings?.prices || {});
  //   });
  // }, []);

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
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Logo</Form.Label>
                          <Form.Control
                            type="text"
                            value={generalSettings.logo}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                logo: e.target.value,
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The URL for the logo.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>New User Bonus</Form.Label>
                          <Form.Control
                            type="number"
                            value={generalSettings.newUserBonus}
                            onChange={(e) =>
                              setGeneralSettings({
                                ...generalSettings,
                                newUserBonus: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The bonus for new users.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="coinSettings" title="Coin">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      {[
                        "cost",
                        "image",
                        "video",
                        "response",
                        "review",
                        "validation",
                      ].map((tag) => (
                        <Col key={tag}>
                          <SettingsFormInput
                            type="coin"
                            tag={tag}
                            label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                            helpText={`The cost of each ${tag} in coins.`}
                          />
                        </Col>
                      ))}
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
                          <Form.Label>Max Retries</Form.Label>
                          <Form.Control
                            type="number"
                            value={scrapSettings.maxRetries}
                            onChange={(e) =>
                              setScrapSettings({
                                ...scrapSettings,
                                maxRetries: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The number of retries.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="dockerSettings" title="Docker">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum CPU</Form.Label>
                          <Form.Control
                            type="number"
                            value={dockerSettings.minCpu}
                            onChange={(e) =>
                              setDockerSettings({
                                ...dockerSettings,
                                minCpu: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum number of CPUs.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum RAM</Form.Label>
                          <Form.Control
                            type="number"
                            value={dockerSettings.minRam}
                            onChange={(e) =>
                              setDockerSettings({
                                ...dockerSettings,
                                minRam: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum amount of RAM.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Minimum Storage</Form.Label>
                          <Form.Control
                            type="number"
                            value={dockerSettings.minStorage}
                            onChange={(e) =>
                              setDockerSettings({
                                ...dockerSettings,
                                minStorage: parseInt(e.target.value),
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The minimum amount of storage.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="stripeSettings" title="Stripe">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Secret</Form.Label>
                          <Form.Control
                            type="text"
                            value={stripeSettings.secret}
                            onChange={(e) =>
                              setStripeSettings({
                                ...stripeSettings,
                                secret: e.target.value,
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The secret key for stripe.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Webhook secret</Form.Label>
                          <Form.Control
                            type="text"
                            value={stripeSettings.webhook}
                            onChange={(e) =>
                              setStripeSettings({
                                ...stripeSettings,
                                webhook: e.target.value,
                              })
                            }
                          />
                          <Form.Text className="text-muted">
                            The webhook for stripe.
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
      </Row>
    </Container>
  );
};
