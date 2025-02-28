import { Breadcrumb, Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Reviews list page
 * @returns JSX.Element
 */
export const ReviewsList = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Reviews list</Breadcrumb.Item>
      </Breadcrumb>

      <ContainersList type="comments" path="reviews" />
    </Container>
  );
};
