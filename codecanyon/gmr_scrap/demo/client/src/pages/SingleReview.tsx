import {
  IconLibraryPhoto,
  IconMessage,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactPlayer from "react-player";
import { useOutletContext, useParams } from "react-router-dom";
import { CommentView } from "../components/comments/CommentReview";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { Ratings } from "../components/Ratings";
import {
  IComment,
  scrapData,
  scrapImages,
  scrapVideos,
  validateUrlData,
} from "../services/scrapService";
import { CommentQAView } from "../components/CommentQAView";
import { CommentResponseView } from "../components/CommentResponseView";
import { CommentImages } from "../components/CommentImages";
import { CommentVideos } from "../components/CommentVideos";
import { Subject, debounceTime, filter, map, pipe, take } from "rxjs";
import { IDockerContainer } from "../types/dockerContainer";
import { dockerContainers } from "../services/dockerService";
import { CommentsList } from "../components/comments/CommentsList";
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
        <Col md={9}>
          <Tabs
            defaultActiveKey="comments"
            id="scrap-tabs"
            variant="underline"
            className="border-bottom"
          >
            <Tab
              eventKey="comments"
              title={
                <>
                  <IconMessage size={24} />
                  <span className="ms-2">Comments</span>
                </>
              }
            >
              <Stack direction="horizontal" className="mt-3">
                <div className="d-inline-block me-auto">
                  <InputGroup>
                    <InputGroup.Text id="search-icon">
                      <IconSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      id="search"
                      placeholder="Search..."
                      aria-label="Search"
                      aria-describedby="search-icon"
                      onChange={(e) => searchSubject.next(e.target.value)}
                      // value={search}
                    />
                  </InputGroup>
                </div>
                <Dropdown autoClose="outside">
                  <Dropdown.Toggle id="dropdown-filter" variant="secondary">
                    Filter
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterOptions({
                          ...filterOptions,
                          onlyImages: !filterOptions.onlyImages,
                        });
                      }}
                    >
                      <Form>
                        <Form.Check
                          type="checkbox"
                          id="filter-image-checkbox"
                          label="Image comments"
                          checked={filterOptions.onlyImages}
                        />
                      </Form>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterOptions({
                          ...filterOptions,
                          onlyVideos: !filterOptions.onlyVideos,
                        });
                      }}
                    >
                      <Form>
                        <Form.Check
                          type="checkbox"
                          id="filter-video-checkbox"
                          label="Video comments"
                          checked={filterOptions.onlyVideos}
                        />
                      </Form>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterOptions({
                          ...filterOptions,
                          onlyQA: !filterOptions.onlyQA,
                        });
                      }}
                    >
                      <Form>
                        <Form.Check
                          type="checkbox"
                          id="filter-qa-checkbox"
                          label="QA comments"
                          checked={filterOptions.onlyQA}
                        />
                      </Form>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        setFilterOptions({
                          ...filterOptions,
                          onlyResponse: !filterOptions.onlyResponse,
                        });
                      }}
                    >
                      <Form>
                        <Form.Check
                          type="checkbox"
                          id="filter-response-checkbox"
                          label="Response comments"
                          checked={filterOptions.onlyResponse}
                        />
                      </Form>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Stack>
              <CommentsList
                reviewId={reviewId}
                uid={uid}
                filterOptions={filterOptions}
                search={search}
              />
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
        <Col md={3}>
          <PlaceInfo containerId={reviewId} />
        </Col>
      </Row>
    </Container>
  );
};
