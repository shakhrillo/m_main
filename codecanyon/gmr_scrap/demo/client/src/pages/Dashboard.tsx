import { IconMapPinFilled } from "@tabler/icons-react";
import { User } from "firebase/auth";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IReview, validatedUrls } from "../services/scrapService";

const iconHtml = ReactDOMServer.renderToString(<IconMapPinFilled size={24} />);

// Fix default marker icons in Leaflet
L.Marker.prototype.options.icon = L.divIcon({
  html: iconHtml,
  iconSize: [24, 24],
});

// Component to dynamically fit the map bounds to marker locations
const FitBounds = ({ locations }: { locations: [number, number][] }) => {
  const map = useMap();

  if (locations.length > 0) {
    const bounds = L.latLngBounds(locations);
    map.fitBounds(bounds, { padding: [50, 50] }); // Adjust padding as needed
  }

  return null;
};

export const Dashboard: React.FC = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([] as IReview[]);
  const [markerLocations, setMarkerLocations] = useState(
    [] as [number, number][],
  );

  useEffect(() => {
    const subscription = validatedUrls(uid, "comments").subscribe((data) => {
      setReviews(data);

      const locations = data
        .filter(
          (review) =>
            review.location &&
            review.location.latitude &&
            review.location.longitude,
        )
        .map((review) => {
          return [review.location?.latitude, review.location?.longitude] as [
            number,
            number,
          ];
        });

      setMarkerLocations(locations);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h1>Reviews</h1>
              <p>
                This is a demo of a dashboard with a map and a list of reviews.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/add")}
              >
                Add Review
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div style={{ height: "350px" }}>
                <MapContainer
                  zoom={3}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitBounds locations={markerLocations} />
                  {reviews.map((review) =>
                    review.location &&
                    review.location.latitude &&
                    review.location.longitude ? (
                      <Marker
                        key={review.id}
                        position={[
                          review.location.latitude,
                          review.location.longitude,
                        ]}
                      >
                        <Popup>
                          <strong>{review.title}</strong>
                          <br />
                          {review.reviews} reviews
                        </Popup>
                      </Marker>
                    ) : null,
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row row-cols-2 g-3">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Reviews</h5>
                  <h2 className="fs-1">{reviews.length}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Locations</h5>
                  <h2 className="fs-1">{markerLocations.length}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <h2 className="fs-1">0</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Comments</h5>
                  <h2 className="fs-1">0</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Likes</h5>
                  <h2 className="fs-1">0</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Dislikes</h5>
                  <h2 className="fs-1">0</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Reviews</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>{review.title}</td>
                      <td>{review.reviews}</td>
                      <td>
                        {review.location &&
                        review.location.latitude &&
                        review.location.longitude ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${review.location.latitude},${review.location.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {review.location.latitude},{" "}
                            {review.location.longitude}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
