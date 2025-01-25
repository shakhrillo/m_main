import {
  IconLibraryPhoto,
  IconMessage,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactPlayer from "react-player";
import { useOutletContext, useParams } from "react-router-dom";
import { Subject, filter, map } from "rxjs";
import { CommentsList } from "../components/comments/CommentsList";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { dockerContainers } from "../services/dockerService";
import { IComment } from "../services/scrapService";
import { IDockerContainer } from "../types/dockerContainer";
const searchSubject = new Subject<string>();

export const SingleReview = () => {
  const { uid } = useOutletContext<User>();
  const { reviewId } = useParams() as { reviewId: string };
  // const [info, setPlaceInfo] = useState<any>({});
  const [reviews, setReviews] = useState<IComment[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    onlyImages: boolean;
    onlyVideos: boolean;
    onlyQA: boolean;
    onlyResponse: boolean;
  }>({
    onlyImages: false,
    onlyVideos: false,
    onlyQA: false,
    onlyResponse: false,
  });
  const [search, setSearch] = useState("");
  const [container, setContainer] = useState<IDockerContainer>({});

  useEffect(() => {
    const subscription = dockerContainers({
      containerId: reviewId,
    })
      .pipe(
        map((data) => {
          if (data.length > 0) {
            return data[0];
          }

          return null;
        }),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [reviewId]);

  return (
    <Container>
      <Row>
        <Col md={8}>
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
              <div className="row row-cols-6 g-2">
                <Gallery
                  options={{
                    zoom: false,
                    showHideAnimationType: "none",
                    hideAnimationDuration: 0,
                    showAnimationDuration: 0,
                    zoomAnimationDuration: 0,
                    bgOpacity: 0.9,
                  }}
                >
                  {images.map((img, index) => (
                    <Item original={img.thumb || img.videoUrl} key={index}>
                      {({ ref, open }) => (
                        <div className="col">
                          <img
                            ref={ref}
                            onClick={open}
                            src={img.thumb || img.videoUrl}
                            alt={`Review ${index}`}
                            className="img-fluid img-thumbnail rounded"
                          />
                        </div>
                      )}
                    </Item>
                  ))}
                </Gallery>
              </div>
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
              <div className="row row-cols-6 g-2">
                {videos.map((video, index) => (
                  <div className="col" key={index}>
                    <ReactPlayer
                      url={video.videoUrl}
                      controls
                      width="100%"
                      height="100%"
                    />
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </Col>
        <Col md={4}>
          <PlaceInfo containerId={reviewId} />
        </Col>
      </Row>
    </Container>
  );
};
