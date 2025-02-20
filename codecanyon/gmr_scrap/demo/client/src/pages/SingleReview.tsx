import { IconLibraryPhoto, IconMessage, IconVideo } from "@tabler/icons-react";
import { Badge, Breadcrumb, Col, Container, Row, Stack, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { CommentsList } from "../components/comments/CommentsList";
import { ImagesList } from "../components/images/ImagesList";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { VideosList } from "../components/videos/VideosList";
import { IDockerContainer } from "../types/dockerContainer";
import { useEffect, useState } from "react";
import { filter, map } from "rxjs";
import { auth } from "../firebaseConfig";
import { dockerContainers } from "../services/dockerService";

export const SingleReview = () => {
  const navigate = useNavigate();
  const { reviewId } = useParams() as { reviewId: string };
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!reviewId || !auth.currentUser?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({
      containerId: reviewId,
      uid: auth.currentUser?.uid,
    })
    .pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        const containers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }));
        return containers[0];
      })
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
  }, [reviewId, auth.currentUser?.uid]);

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
          <Tabs defaultActiveKey="comments" variant="pills">
            <Tab
              eventKey="comments"
              title={
                <Stack direction="horizontal" gap={2}>
                  <IconMessage />
                  <h6 className="m-0">Comments</h6>
                  <Badge>
                    { container.totalReviews }
                  </Badge>
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
                  <h6 className="m-0">Images</h6>
                  <Badge>
                    { container.totalImages }
                  </Badge>
                </Stack>
              }
            >
              <ImagesList reviewId={reviewId} />
            </Tab>
            <Tab
              eventKey="videos"
              title={
                <>
                  <IconVideo size={24} />
                  <span className="ms-3">Videos</span>
                </>
              }
            >
              <VideosList reviewId={reviewId} />
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
