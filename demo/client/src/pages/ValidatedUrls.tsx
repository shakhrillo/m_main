import { Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Validated URLs page
 * @returns JSX.Element
 */
export const ValidatedURLs = () => {
  return (
    <Container>
      <ContainersList path="scrap" type="info" />
    </Container>
  );
};
