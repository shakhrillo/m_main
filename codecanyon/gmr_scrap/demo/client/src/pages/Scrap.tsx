import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Row, Stack } from "react-bootstrap";
import { filter, map, take } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { ScrapExtractType } from "../components/scrap/ScrapExtractType";
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { getAuth } from "firebase/auth";

/**
 * Scrap page.
 * @returns JSX.Element
 */
export const Scrap = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const { scrapId } = useParams<{ scrapId: string }>();
  const [container, setContainer] = useState<IDockerContainer>({} as IDockerContainer);

  useEffect(() => {
    if (!scrapId || !auth.currentUser?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({ containerId: scrapId, uid: auth.currentUser?.uid })
      .pipe(
        filter(snapshot => !!snapshot),
        map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as IDockerContainer }))[0]),
        filter(data => data !== undefined && data?.status === "completed" && data?.machine?.Action === "die"),
        take(1)
      )
      .subscribe(data => {
        console.log(data);
        setContainer(data?.location ? data : ({} as IDockerContainer));
      });

    return () => subscription.unsubscribe();
  }, [scrapId, auth.currentUser?.uid]);

  return (
    <Container className="scrap">
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/scrap")} active>
          Scrap
        </Breadcrumb.Item>
        {scrapId && <Breadcrumb.Item active>{container.title || scrapId}</Breadcrumb.Item>}
      </Breadcrumb>
      <Row className="g-3">
        <Col lg={8} xl={9}>
          <Stack direction="vertical" gap={3}>
            <ScrapValidateURL containerId={scrapId} container={container} />
            <ScrapExtractType containerId={scrapId} container={container} />
            <ScrapExtractOptions containerId={scrapId} container={container} />
          </Stack>
        </Col>
        <Col lg={4} xl={3}>
          <PlaceInfo container={container} />
          <ScrapExpectedPoints containerId={scrapId || ''} />
        </Col>
      </Row>
    </Container>
  );
};
