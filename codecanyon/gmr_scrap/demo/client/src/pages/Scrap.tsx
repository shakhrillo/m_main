import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Row, Stack } from "react-bootstrap";
import { filter, map, take } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { getAuth } from "firebase/auth";
import { ScrapExtractType } from "../components/scrap/ScrapExtractType";

export const Scrap = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const { scrapId } = useParams() as { scrapId: string };
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!scrapId || !auth.currentUser?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId: scrapId,
      uid: auth.currentUser?.uid,
    })
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) => {
          const containers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }));
          return containers[0];
        }),
        take(1),
      )
      .subscribe((data) => {
        if (!data || !data.location) {
          setContainer({} as IDockerContainer);
          return;
        }
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [scrapId, auth.currentUser?.uid]);

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
        <Col lg={8} xl={9}>
          <Stack direction={"vertical"} gap={3}>
            <ScrapValidateURL containerId={scrapId} container={container} />
            <ScrapExtractType  containerId={scrapId} container={container} />
            <ScrapExtractOptions containerId={scrapId} container={container} />
          </Stack>
        </Col>
        <Col lg={4} xl={3}>
          <PlaceInfo containerId={scrapId} />
          <ScrapExpectedPoints containerId={scrapId} />
        </Col>
      </Row>
    </Container>
  );
};
