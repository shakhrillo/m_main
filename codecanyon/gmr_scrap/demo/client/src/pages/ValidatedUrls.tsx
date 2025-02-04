import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";
export const ValidatedURLs = () => {
  return (
    <Container fluid>
      <Breadcrumb>
        <Breadcrumb.Item>Reviews</Breadcrumb.Item>
        <Breadcrumb.Item active>Validates</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
        <Col xs={12}>
          <ContainersList path="scrap" type="info" />
        </Col>
      </Row>
    </Container>
  );
};
