import { Breadcrumb, Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Validated URLs page
 * @returns JSX.Element
 */
export const ValidatedURLs = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Validates</Breadcrumb.Item>
      </Breadcrumb>

      <ContainersList path="scrap" type="info" />
    </Container>
  );
};
