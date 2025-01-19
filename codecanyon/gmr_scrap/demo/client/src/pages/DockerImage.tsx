import { Col, Container, Row } from "react-bootstrap";
import { DockerImageDetails } from "../components/DockerImageDetails";
import { DockerImageLayers } from "../components/DockerImageLayers";

export const DockerImage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <DockerImageLayers />
        </Col>
        <Col md={3}>
          <DockerImageDetails />
        </Col>
      </Row>
    </Container>
  );
};
