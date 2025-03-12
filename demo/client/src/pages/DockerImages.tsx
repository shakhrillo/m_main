import { Container } from "react-bootstrap";
import { DockerImagesList } from "../components/docker/DockerImagesList";

/**
 * Docker images list page
 */
export const ImagesList = () => {
  return (
    <Container>
      <DockerImagesList />
    </Container>
  );
};
