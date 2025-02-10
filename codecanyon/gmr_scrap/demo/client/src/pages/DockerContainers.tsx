import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

export const DockerContainers = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item>Docker</Breadcrumb.Item>
        <Breadcrumb.Item active>Containers</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
        <Col xs={12}>
          <ContainersList path="containers" />
        </Col>
      </Row>
    </Container>
  );
};
