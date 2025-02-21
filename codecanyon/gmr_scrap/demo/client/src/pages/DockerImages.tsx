import { Breadcrumb, Container } from "react-bootstrap";
import { DockerImagesList } from "../components/docker/DockerImagesList";

/**
 * Docker images list page
 */
export const ImagesList = () => {
  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Images</Breadcrumb.Item>
      </Breadcrumb>

      <DockerImagesList />
    </Container>
  );
};
