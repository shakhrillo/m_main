import { User } from "firebase/auth";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IReview, validatedUrls } from "../services/scrapService";

// Fix default marker icons in Leaflet
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
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

const Dashboard: React.FC = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([] as IReview[]);
  const position: [number, number] = [51.505, -0.09]; // Default position

  useEffect(() => {
    const subscription = validatedUrls(uid, "comments").subscribe((data) => {
      console.log("data", data);
      setReviews(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Extract marker locations
  const markerLocations = reviews
    .filter(
      (review) =>
        review.location &&
        review.location.latitude &&
        review.location.longitude,
    )
    .map((review) => {
      if (review.location) {
        return [review.location.latitude, review.location.longitude] as [
          number,
          number,
        ];
      }
      return [0, 0] as [number, number]; // Default value if location is undefined
    });

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <h1>Earnings</h1>
              <p>Coming soon...</p>
            </div>
            <div className="col">
              <h1>New Users</h1>
              <p>Coming soon...</p>
            </div>
            <div className="col">
              <div style={{ height: "100vh" }}>
                <MapContainer
                  center={position}
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
      </div>
    </div>
  );
};

export default Dashboard;
