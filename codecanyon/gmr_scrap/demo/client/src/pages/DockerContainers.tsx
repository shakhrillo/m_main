import { Col, Container, Row } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

export const DockerContainers = () => {
  return (
    <Container>
      <Row className="g-3">
        <Col xs={12}>
          <ContainersList path="containers" />
        </Col>
      </Row>
    </Container>
  );
};
