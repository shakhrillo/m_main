import { Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { SettingsFormInput } from "../components/SettingsFormInput";

const SETTINGS_TABS = [
  {
    eventKey: "generalSettings",
    title: "General",
    type: "general",
    fields: [
      { tag: "logo", label: "Logo", helpText: "The URL for the logo.", inputType: "text" },
      { tag: "favicon", label: "Favicon", helpText: "The URL for the favicon.", inputType: "text" },
      { tag: "title", label: "Title", helpText: "The title of the website.", inputType: "text" },
      { tag: "keywords", label: "Keywords", helpText: "The keywords of the website.", inputType: "text"},
      { tag: "description", label: "Description", helpText: "The description of the website.", inputType: "textarea" },
      { tag: "security", label: "Security", helpText: "The security of the website.", inputType: "textarea" },
      { tag: "help", label: "Help", helpText: "The help of the website.", inputType: "textarea" },
      { tag: "info", label: "Info", helpText: "The info of the website.", inputType: "textarea" },
    ],
  },
  {
    eventKey: "coinSettings",
    title: "Coin",
    type: "coin",
    fields: [
      { tag: "cost", label: "Cost", helpText: "The cost of each coin.", inputType: "text" },
      { tag: "bonus", label: "Bonus", helpText: "The bonus of each coin.", inputType: "text" },
      { tag: "image", label: "Image", helpText: "The cost of each image in coins.", inputType: "text" },
      { tag: "video", label: "Video", helpText: "The cost of each video in coins.", inputType: "text" },
      { tag: "response", label: "Response", helpText: "The cost of each response in coins.", inputType: "text" },
      { tag: "review", label: "Review", helpText: "The cost of each review in coins.", inputType: "text" },
      { tag: "validation", label: "Validation", helpText: "The cost of each validation in coins.", inputType: "text" },
    ],
  }, {
    eventKey: "scrapSettings",
    title: "Scrap",
    type: "scrap",
    fields: [
      { tag: "minimum", label: "Minimum", helpText: "The minimum of scrapes.", inputType: "text" },
      { tag: "maximum", label: "Maximum", helpText: "The maximum of scrapes.", inputType: "text" },
      { tag: "retries", label: "Retries", helpText: "The retries of scrapes.", inputType: "text" },
    ],
  }
];

export const Settings = () => {
  return (
    <Container>
      <Tabs variant="pills" defaultActiveKey="generalSettings">
        {
          SETTINGS_TABS.map(({ eventKey, title, type, fields }) => (
            <Tab eventKey={eventKey} title={title} key={eventKey}>
              <Form className="settings">
                <Row>
                  {
                    fields.map(({ tag, label, helpText, inputType }) => (
                      <Col key={tag} md={6}>
                        <SettingsFormInput
                          type={type}
                          tag={tag}
                          label={label}
                          helpText={helpText}
                          inputType={inputType}
                        />
                      </Col>
                    ))
                  }
                </Row>
              </Form>
            </Tab>
          ))
        }
      </Tabs>
    </Container>
  );
};
