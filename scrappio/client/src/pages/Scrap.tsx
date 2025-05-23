import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { filter, map } from "rxjs";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { ScrapExpectedPoints } from "../components/scrap/ScrapExpectedPoints";
import { ScrapExtractOptions } from "../components/scrap/ScrapExtractOptions";
import { ScrapValidateURL } from "../components/scrap/ScrapValidateURL";
import { ScrapExtractType } from "../components/scrap/ScrapExtractType";
import { dockerContainers } from "../services/dockerService";
import type { IDockerContainer } from "../types/dockerContainer";
import type { IUserInfo } from "../types/userInfo";

/**
 * Scrap page.
 * @returns JSX.Element
 */
export const Scrap = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();
  const { scrapId } = useParams<{ scrapId: string }>();
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!scrapId || !user?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId: scrapId,
      uid: !user.isAdmin ? user.uid : undefined,
    })
      .pipe(
        filter((snapshot) => !!snapshot),
        map(
          (snapshot) =>
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }))[0],
        ),
      )
      .subscribe((data) => {
        setContainer(data?.location ? data : ({} as IDockerContainer));
      });

    return () => subscription.unsubscribe();
  }, [scrapId, user]);

  return (
    <Container className="scrap">
      {scrapId && (
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/scrap")}>
            Scrap
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{container.title || scrapId}</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <Row className="g-3">
        {user?.coinBalance <= 0 && (
          <Col sm={12}>
            <Alert variant="warning">
              You have no coins to scrap. Please top up your balance.
            </Alert>
            <Button onClick={() => navigate("/payments")} variant="primary">
              Top Up Coins
            </Button>
          </Col>
        )}
        {(user?.email === "user@user.com" ||
          user?.email === "admin@admin.com") && (
          <Col sm={12}>
            <Alert variant="warning">
              For demo purposes, you can not scrap. Please purchase the full
              version. Or sign up with a different email to get bonus coins and
              scrap.
            </Alert>
            <Button
              onClick={() => (window.location.href = "https://codecanyon.net")}
              variant="primary"
            >
              Purchase Full Version
            </Button>
          </Col>
        )}
        <Col lg={8} xl={9}>
          <Stack direction="vertical" gap={3}>
            <ScrapValidateURL containerId={scrapId} container={container} />
            <ScrapExtractType container={container} />
            <ScrapExtractOptions container={container} />
          </Stack>
        </Col>
        <Col lg={4} xl={3}>
          <PlaceInfo container={container} />
          <ScrapExpectedPoints container={container} />
        </Col>
      </Row>
    </Container>
  );
};
