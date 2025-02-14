import { Breadcrumb, Card, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { SettingsFormInput } from "../components/SettingsFormInput";

const SETTINGS_TABS = [
  {
    eventKey: "generalSettings",
    title: "General",
    type: "general",
    fields: [
      { tag: "logo", label: "Logo", helpText: "The URL for the logo." },
      { tag: "favicon", label: "Favicon", helpText: "The URL for the favicon." },
      { tag: "title", label: "Title", helpText: "The title of the website." },
      { tag: "description", label: "Description", helpText: "The description of the website." },
      { tag: "keywords", label: "Keywords", helpText: "The keywords of the website." },
    ],
  },
  {
    eventKey: "coinSettings",
    title: "Coin",
    type: "coin",
    fields: [
      { tag: "cost", label: "Cost", helpText: "The cost of each coin." },
      { tag: "image", label: "Image", helpText: "The cost of each image in coins." },
      { tag: "video", label: "Video", helpText: "The cost of each video in coins." },
      { tag: "response", label: "Response", helpText: "The cost of each response in coins." },
      { tag: "review", label: "Review", helpText: "The cost of each review in coins." },
      { tag: "validation", label: "Validation", helpText: "The cost of each validation in coins." },
    ],
  }, {
    eventKey: "scrapSettings",
    title: "Scrap",
    type: "scrap",
    fields: [
      { tag: "minimum", label: "Minimum", helpText: "The minimum of scrapes." },
      { tag: "maximum", label: "Maximum", helpText: "The maximum of scrapes." },
      { tag: "retries", label: "Retries", helpText: "The retries of scrapes." },
    ],
  }
];

export const Settings = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Setttings</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs
        defaultActiveKey="generalSettings"
        id="mainSettings"
      >
        {
          SETTINGS_TABS.map(({ eventKey, title, type, fields }) => (
            <Tab eventKey={eventKey} title={title} key={eventKey}>
              <Card className="border-top-0 rounded-top-0">
                <Card.Body>
                  <Form>
                    <Row>
                      {
                        fields.map(({ tag, label, helpText }) => (
                          <Col key={tag} md={6}>
                            <SettingsFormInput
                              type={type}
                              tag={tag}
                              label={label}
                              helpText={helpText}
                            />
                          </Col>
                        ))
                      }
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          ))
        }
      </Tabs>
    </Container>
  );
};
