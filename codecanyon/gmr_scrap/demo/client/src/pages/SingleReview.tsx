import { IconLibraryPhoto, IconMessage, IconVideo } from "@tabler/icons-react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { CommentsList } from "../components/comments/CommentsList";
import { ImagesList } from "../components/images/ImagesList";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { VideosList } from "../components/videos/VideosList";

export const SingleReview = () => {
  const { reviewId } = useParams() as { reviewId: string };
  return (
    <Container fluid>
      <Row>
        <Col md={9}>
          <Tabs defaultActiveKey="comments" id="scrap-tabs" variant="underline">
            <Tab
              eventKey="comments"
              title={
                <div>
                  <IconMessage />
                  <span className="ms-2">Comments</span>
                </div>
              }
            >
              <CommentsList reviewId={reviewId} />
            </Tab>
            <Tab
              eventKey="images"
              title={
                <>
                  <IconLibraryPhoto size={24} />
                  <span className="ms-3">Images</span>
                </>
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
          <PlaceInfo containerId={reviewId} />
        </Col>
      </Row>
    </Container>
  );
};
