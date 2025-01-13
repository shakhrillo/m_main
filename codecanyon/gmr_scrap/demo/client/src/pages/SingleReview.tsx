import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
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
    <div className="container-fluid">
      <div className="row row-cols-1 g-3">
        <div className="col">
          <div className="card">
            <div className="row g-0">
              <div className="col-md-4">
                {info?.location ? (
                  <div style={{ height: "300px" }}>
                    <Map
                      className="w-100 h-100"
                      defaultCenter={{
                        lat: info?.location?.latitude,
                        lng: info?.location?.longitude,
                      }}
                      defaultZoom={18}
                      gestureHandling={"greedy"}
                      disableDefaultUI={true}
                    >
                      <Marker
                        position={{
                          lat: info?.location?.latitude,
                          lng: info?.location?.longitude,
                        }}
                        clickable={true}
                        onClick={() => alert("marker was clicked!")}
                        title={"clickable google.maps.Marker"}
                      />
                    </Map>
                  </div>
                ) : null}
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{info.title}</h5>
                  <a
                    href={info.extendedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="card-text"
                  >
                    {info.address}
                  </a>
                  <hr />
                  <ul className="list-unstyled">
                    <li>
                      <strong>Status:</strong> {info.status}
                    </li>
                    <li>
                      <strong>Average Rating:</strong>{" "}
                      {info.rating ? info.rating : "N/A"}
                    </li>
                    <li>
                      <strong>Extracted Reviews:</strong>{" "}
                      {info.totalReviews || 0}
                    </li>
                    <li>
                      <strong>Spent Time:</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <Tabs
                defaultActiveKey="comments"
                id="scrap-tabs"
                className="mb-3"
              >
                <Tab eventKey="comments" title="Comments">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>QA</th>
                        <th>Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => (
                        <tr key={review.id}>
                          <td>{}</td>
                          <td>{review.rating}</td>
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
                <Tab eventKey="images" title="Images">
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
                <Tab eventKey="videos" title="Videos">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
