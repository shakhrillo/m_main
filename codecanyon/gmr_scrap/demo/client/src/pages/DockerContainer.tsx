import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { filter, map, take } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { ContainerCharts } from "./container/containerCharts";

export const DockerContainer = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const subscription = dockerContainers({ containerId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
        take(1),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  return (
    <Container>
      <Row className="g-3">
        <Col md={8}>
          <Row className="g-3 row-cols-1">
            <ContainerCharts containerId={containerId} />
          </Row>
        </Col>
        <Col md={4}>
          <PlaceInfo containerId={containerId || ""} container={container} />
        </Col>
      </Row>
    </Container>
  );
};
