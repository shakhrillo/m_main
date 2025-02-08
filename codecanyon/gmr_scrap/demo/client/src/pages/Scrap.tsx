import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Row, Stack } from "react-bootstrap";
import { filter, map } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";

export const Scrap = () => {
  const navigate = useNavigate();

  const { scrapId } = useParams() as { scrapId: string };
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!scrapId) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({ containerId: scrapId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [scrapId]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/scrap");
          }}
          active
        >
          Scrap
        </Breadcrumb.Item>
        {scrapId && (
          <Breadcrumb.Item active>{container.title || scrapId}</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <Row className="g-3">
        <Col md={9}>
          <Stack direction={"vertical"} gap={3}>
            <ScrapValidateURL containerId={scrapId} container={container} />
            <ScrapExtractOptions containerId={scrapId} container={container} />
          </Stack>
        </Col>
        <Col md={3}>
          <PlaceInfo containerId={scrapId} />
          <ScrapExpectedPoints containerId={scrapId} />
        </Col>
      </Row>
    </Container>
  );
};
