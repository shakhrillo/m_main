import { Col, Container, Row } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

export const ReviewsList = () => {
  return (
    <Container>
      <Row className="g-3">
        <Col xs={12}>
          <ContainersList type="comments" path="reviews" />
        </Col>
      </Row>
    </Container>
  );
};
