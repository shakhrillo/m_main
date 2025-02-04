import { Container, Row, Col, Card, CardBody } from "react-bootstrap";

export const Info: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>Info</h4>
              <p>
                This is a demo application for scraping reviews from Google
                Maps.
              </p>
              <h4>How to scrape reviews?</h4>
              <p>
                To scrape reviews, go to the Scrap page and enter the URL of the
                place you want to scrape reviews from.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
