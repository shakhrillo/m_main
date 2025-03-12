import { Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Docker containers page
 * @returns JSX.Element
 */
export const DockerContainers = () => {
  return (
    <Container>
      <ContainersList path="containers" machineType="container" />
    </Container>
  );
};
