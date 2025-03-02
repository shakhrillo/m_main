import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { filter, map } from "rxjs";
import { dockerContainers } from "../services/dockerService";
import type { IDockerContainer } from "../types/dockerContainer";
import type { IUserInfo } from "../types/userInfo";

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
import { CommentsList } from "../components/comments/CommentsList";
import { ImagesList } from "../components/images/ImagesList";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { VideosList } from "../components/videos/VideosList";

/**
 * Single review page component.
 */
export const SingleReview = () => {
  const user = useOutletContext<IUserInfo>();
  const navigate = useNavigate();
  const { reviewId } = useParams<{ reviewId: string }>();
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
      uid: user.isAdmin ? undefined : user.uid,
    })
      .pipe(
        filter(Boolean),
        map(
          (snapshot) =>
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }))[0],
        ),
      )
      .subscribe((data) =>
        setContainer(data?.location ? data : ({} as IDockerContainer)),
      );

    return () => subscription.unsubscribe();
  }, [reviewId, user]);

  const renderTab = (
    eventKey: string,
    Icon: any,
    title: string,
    count?: number,
    Component?: any,
  ) => (
    <Tab
      eventKey={eventKey}
      title={
        <Stack direction="horizontal" gap={2}>
          <Icon size={20} />
          {title}
          {count && <Badge>{count}</Badge>}
        </Stack>
      }
    >
      {Component && <Component container={container} reviewId={reviewId} />}
    </Tab>
  );

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/reviews")}>
          Reviews
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{container.title}</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col md={9}>
          <Tabs variant="pills" defaultActiveKey="comments">
            {renderTab(
              "comments",
              IconMessage,
              "Comments",
              container.totalReviews,
              CommentsList,
            )}
            {renderTab(
              "images",
              IconLibraryPhoto,
              "Images",
              container.totalImages,
              ImagesList,
            )}
            {renderTab(
              "videos",
              IconVideo,
              "Videos",
              container.totalVideos,
              VideosList,
            )}
          </Tabs>
        </Col>
        <Col md={3}>
          <PlaceInfo container={container} />
        </Col>
      </Row>
    </Container>
  );
};
