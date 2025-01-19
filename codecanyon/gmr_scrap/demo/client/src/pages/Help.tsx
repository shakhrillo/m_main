import React from "react";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";

export const Help: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>How to scrape reviews?</h4>
              <p>
                To scrape reviews, go to the Scrap page and enter the URL of the
                place you want to scrape reviews from.
              </p>
              <h4>How to download reviews?</h4>
              <p>
                To download reviews, go to the Scrap page and click the download
                button.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
