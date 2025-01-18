import { Card, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { SettingsFormInput } from "../components/SettingsFormInput";

export const Settings = () => {
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
                      {[
                        {
                          tag: "logo",
                          label: "Logo",
                          helpText: "The URL for the logo.",
                        },
                        {
                          tag: "favicon",
                          label: "Favicon",
                          helpText: "The URL for the favicon.",
                        },
                        {
                          tag: "title",
                          label: "Title",
                          helpText: "The title of the website.",
                        },
                        {
                          tag: "description",
                          label: "Description",
                          helpText: "The description of the website.",
                        },
                        {
                          tag: "keywords",
                          label: "Keywords",
                          helpText: "The keywords of the website.",
                        },
                      ].map(({ tag, label, helpText }) => (
                        <Col key={tag}>
                          <SettingsFormInput
                            type="general"
                            tag={tag}
                            label={label}
                            helpText={helpText}
                          />
                        </Col>
                      ))}
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
                      {["minimum", "maximum", "retries"].map((tag) => (
                        <Col key={tag}>
                          <SettingsFormInput
                            type="scrap"
                            tag={tag}
                            label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                            helpText={`The ${tag} of scrapes.`}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="dockerSettings" title="Docker">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      {["minimumCPU", "minimumRAM", "minimumStorage"].map(
                        (tag) => (
                          <Col key={tag}>
                            <SettingsFormInput
                              type="docker"
                              tag={tag}
                              label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                              helpText={`The ${tag} of docker.`}
                            />
                          </Col>
                        ),
                      )}
                    </Row>
                  </Form>
                </Tab>
                <Tab eventKey="stripeSettings" title="Stripe">
                  <Form>
                    <Row className="g-3 row-cols-md-2">
                      {["publishableKey", "secretKey"].map((tag) => (
                        <Col key={tag}>
                          <SettingsFormInput
                            type="stripe"
                            tag={tag}
                            label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                            helpText={`The ${tag} of stripe.`}
                          />
                        </Col>
                      ))}
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
