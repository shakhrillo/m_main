import { Col, Container, Row } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";
export const ValidatedURLs = () => {
  return (
    <Container>
      <Row className="g-3">
        <Col xs={12}>
          <ContainersList path="scrap" type="info" />
        </Col>
      </Row>
    </Container>
  );
};
