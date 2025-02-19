import { Breadcrumb, Container } from "react-bootstrap";
import { ContainersList } from "../components/containers/ContainersList";

/**
 * Docker containers page
 * @returns JSX.Element
 */
export const DockerContainers = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Containers</Breadcrumb.Item>
      </Breadcrumb>

      <ContainersList path="containers" machineType="container" />
    </Container>
  );
};
