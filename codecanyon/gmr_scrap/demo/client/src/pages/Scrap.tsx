import { useOutletContext, useParams } from "react-router-dom";

import {
  IconCsv,
  IconJson,
  IconMail,
  IconMessageReply,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { useEffect, useState } from "react";
import { dockerContainers } from "../services/dockerService";
import { filter, map, take } from "rxjs";
import { IDockerContainer } from "../types/dockerContainer";

export const Scrap = () => {
  const { uid } = useOutletContext<User>();
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
        // take(1),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [scrapId]);

  return (
    <Container fluid>
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
