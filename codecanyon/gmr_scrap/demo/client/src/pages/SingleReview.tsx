import { IconLibraryPhoto, IconMessage, IconVideo } from "@tabler/icons-react";
import {
  Badge,
  Breadcrumb,
  Col,
  Container,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { CommentsList } from "../components/comments/CommentsList";
import { ImagesList } from "../components/images/ImagesList";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { VideosList } from "../components/videos/VideosList";
import type { IDockerContainer } from "../types/dockerContainer";
import { useEffect, useState } from "react";
import { filter, map } from "rxjs";
import { dockerContainers } from "../services/dockerService";
import type { IUserInfo } from "../types/userInfo";

export const SingleReview = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();
  const { reviewId } = useParams() as { reviewId: string };
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!reviewId || !user?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId: reviewId,
      uid: !user.isAdmin ? user.uid : undefined,
    })
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) => {
          const containers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IDockerContainer),
          }));
          return containers[0];
        }),
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
  }, [reviewId, user]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/reviews");
          }}
        >
          Reviews
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{container.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={9}>
          <Tabs variant="pills" defaultActiveKey="comments">
            <Tab
              eventKey="comments"
              title={
                <Stack direction="horizontal" gap={2}>
                  <IconMessage />
                  Comments
                  <Badge>{container.totalReviews}</Badge>
                </Stack>
              }
            >
              <CommentsList reviewId={reviewId} />
            </Tab>
            <Tab
              eventKey="images"
              title={
                <Stack direction="horizontal" gap={2}>
                  <IconLibraryPhoto />
                  Images
                  <Badge>{container.totalImages}</Badge>
                </Stack>
              }
            >
              <ImagesList container={container} reviewId={reviewId} />
            </Tab>
            <Tab
              eventKey="videos"
              title={
                <Stack direction="horizontal" gap={2}>
                  <IconVideo />
                  Videos
                  <Badge>{container.totalVideos}</Badge>
                </Stack>
              }
            >
              <VideosList container={container} reviewId={reviewId} />
            </Tab>
          </Tabs>
        </Col>
        <Col md={3}>
          <PlaceInfo container={container} />
        </Col>
      </Row>
    </Container>
  );
};
