import React, { useEffect, useState } from "react";
import { useFirebase } from "../contexts/FirebaseProvider";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// Fix default marker icons in Leaflet
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

// Define the type for a review
type Review = {
  id: string;
  name: string;
  comment: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

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
  const { firestore, user } = useFirebase();
  const [reviews, setReviews] = useState<Review[]>([]);
  const position: [number, number] = [51.505, -0.09]; // Default position

  useEffect(() => {
    if (!firestore || !user) return;

    const collectionReviews = collection(
      firestore,
      `users/${user.uid}/reviews`,
    );
    const reviewsQuery = query(
      collectionReviews,
      orderBy("createdAt", "desc"),
      where("type", "==", "comments"),
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      setReviews(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed",
            comment: data.comment || "No comment",
            location: data.location || { latitude: 0, longitude: 0 },
          } as Review;
        }),
      );
    });

    return unsubscribe;
  }, [firestore, user]);

  // Extract marker locations
  const markerLocations = reviews
    .filter((review) => review.location.latitude && review.location.longitude)
    .map(
      (review) =>
        [review.location.latitude, review.location.longitude] as [
          number,
          number,
        ],
    );

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
                    review.location.latitude && review.location.longitude ? (
                      <Marker
                        key={review.id}
                        position={[
                          review.location.latitude,
                          review.location.longitude,
                        ]}
                      >
                        <Popup>
                          <strong>{review.name}</strong>
                          <br />
                          {review.comment}
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
