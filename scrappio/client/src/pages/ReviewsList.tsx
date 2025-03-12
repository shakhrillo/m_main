import { Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Reviews list page
 * @returns JSX.Element
 */
export const ReviewsList = () => {
  return (
    <Container>
      <ContainersList type="comments" path="reviews" />
    </Container>
  );
};
