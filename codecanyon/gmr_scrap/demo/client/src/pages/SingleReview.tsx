import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Gallery, Item } from "react-photoswipe-gallery";
import ReactPlayer from "react-player";
import { useOutletContext, useParams } from "react-router-dom";
import {
  scrapData,
  scrapImages,
  scrapVideos,
  validateUrlData,
} from "../services/scrapService";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { GoogleMap } from "../components/GoogleMap";
import {
  IconLibraryPhoto,
  IconMessage,
  IconStar,
  IconVideo,
} from "@tabler/icons-react";
import { PlaceInfo } from "../components/PlaceInfo";

export const SingleReview = () => {
  const { uid } = useOutletContext<User>();
  const { place } = useParams() as { place: string };
  const [info, setPlaceInfo] = useState<any>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const placeInfoSubbscription = validateUrlData(place, uid).subscribe(
      (data) => {
        console.log("info", data);
        setPlaceInfo(data);
      },
    );

    const reviewsSubscription = scrapData(place, uid).subscribe((data) => {
      console.log("data", data);
      setReviews(data);
    });

    const imagesSubscription = scrapImages(place, uid).subscribe((data) => {
      console.log("images", data);
      setImages(data);
    });

    const videosSubscription = scrapVideos(place, uid).subscribe((data) => {
      console.log("videos", data);
      setVideos(data);
    });

    return () => {
      placeInfoSubbscription.unsubscribe();
      reviewsSubscription.unsubscribe();
    };
  }, [place]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                defaultActiveKey="comments"
                id="scrap-tabs"
                transition={false}
                variant="underline"
                justify={true}
              >
                <Tab
                  className="mt-3"
                  eventKey="comments"
                  title={
                    <>
                      <IconMessage size={24} />
                      <span className="ms-2">Comments</span>
                    </>
                  }
                >
                  <Table borderless responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>QA</th>
                        <th>Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review, index) => (
                        <tr key={review.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <IconStar size={20} />
                              {review.rating}
                            </div>
                          </td>
                          <td>{review.review}</td>
                          <td>
                            <ul>
                              {/* {review..map((qa, index) => (
                        <li key={index} className="list-group-item">
                          <small className="text-nowrap">{qa}</small>
                        </li>
                      ))} */}
                            </ul>
                          </td>
                          <td>{/* {review.response} */}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
                <Tab
                  eventKey="images"
                  title={
                    <>
                      <IconLibraryPhoto size={24} />
                      <span className="ms-2">Images</span>
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
                      <span className="ms-2">Videos</span>
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
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <PlaceInfo info={info} />
        </Col>
      </Row>
    </Container>
  );
};
