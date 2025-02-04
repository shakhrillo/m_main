import { Card, CardBody, Col, Container, Row } from "react-bootstrap";

export const Security = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <h4>How to change password?</h4>
              <p>
                To change password, go to the Account page and click the change
                password button.
              </p>
              <h4>How to delete account?</h4>
              <p>
                To delete account, go to the Account page and click the delete
                account button.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
