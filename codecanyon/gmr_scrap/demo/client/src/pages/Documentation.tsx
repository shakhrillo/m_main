import { Container, Row, Col, Card, CardBody } from "react-bootstrap";

export const Documentation: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>Documentation</h4>
              <p>
                This is a demo application for scraping reviews from Google
                Maps.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
