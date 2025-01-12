import { IconActivity, IconMapPinFilled } from "@tabler/icons-react";
import { User } from "firebase/auth";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IReview, validatedUrls } from "../services/scrapService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  allContainers,
  allUsers,
  appStatistics,
  totalEarnings,
} from "../services/settingService";
import { formatTotalEarnings } from "../utils/formatTotalEarnings";
import { formatTotalUsers } from "../utils/formatTotalUsers";
import { formatTotalContainers } from "../utils/formatTotalContainers";
import { LineChart } from "../components/LineChart";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

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
  const [earnings, setEarnings] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [containers, setContainers] = useState([] as any[]);
  const [statistics, setStatistics] = useState([] as any[]);

  useEffect(() => {
    const appStatisticsSubscription = appStatistics().subscribe((data) => {
      console.log("appStatistics", data);
      setStatistics(data);
    });

    const containersSubscription = allContainers().subscribe((data) => {
      const totalImages = data.reduce(
        (acc: any, e: any) => acc + e.totalImages,
        0,
      );
      const totalOwnerReviews = data.reduce(
        (acc: any, e: any) => acc + e.totalOwnerReviews,
        0,
      );
      const totalReviews = data.reduce(
        (acc: any, e: any) => acc + e.totalReviews,
        0,
      );
      const totalVideos = data.reduce(
        (acc: any, e: any) => acc + e.totalVideos,
        0,
      );

      setContainers([
        totalImages,
        totalOwnerReviews,
        totalReviews,
        totalVideos,
      ]);

      // console.log("containers", formatTotalContainers(data));
      // console.log("containers", data);
      // setContainers(formatTotalContainers(data));
    });

    const earningsSubscription = totalEarnings().subscribe((data) => {
      console.log("earnings", formatTotalEarnings(data));
      setEarnings(formatTotalEarnings(data));
    });

    const usersSubscription = allUsers().subscribe((data) => {
      console.log("users", formatTotalUsers(data));
      setUsers(formatTotalUsers(data));
    });

    const commentsSubscription = validatedUrls(uid, "info").subscribe(
      (data) => {
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
      },
    );

    return () => {
      appStatisticsSubscription.unsubscribe();
      earningsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
      containersSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container-fluid">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Containers</h5>
              <ul className="d-flex gap-2">
                {containers.map((item, index) => (
                  <span className="badge bg-primary">{item}</span>
                ))}
              </ul>

              <div
                className="position-relative border"
                style={{ height: "200px", width: "200px" }}
              >
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="d-flex flex-column align-items-center">
                    <span className="fs-1">
                      {containers.reduce((acc, e) => acc + e, 0)}
                    </span>
                    <p className="m-0 text-muted mt-n3">Total</p>
                  </div>
                </div>
                <Doughnut
                  data={{
                    labels: [],
                    datasets: [
                      {
                        label: "# of Votes",
                        data: containers,
                        backgroundColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                        ],
                        borderRadius: 100,
                        borderAlign: "center",
                        spacing: 1,
                        circular: true,
                        animation: {
                          duration: 0,
                        },
                      },
                    ],
                  }}
                  options={{
                    cutout: 80,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Earnings</h5>
              <div className="fs-1">
                {earnings.reduce((acc, e) => acc + e.total, 0)}
              </div>
              <small>Total earnings for the past 3 months</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <div className="fs-1">
                {users.reduce((acc, e) => acc + e.total, 0)}
              </div>
              <small>Total earnings for the past 3 months</small>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row g-3">
            {statistics.map((item, index) =>
              containers.filter((e) => typeof e[item.id] === "number").length >
              0 ? (
                <div className="col-md-6" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <LineChart
                        total={item.total}
                        labels={containers.map((e) => e.date)}
                        label={item.id}
                        datasets={[
                          {
                            label: item.id,
                            data: containers.map((e) => e[item.id]),
                            tension: 0.2,
                            fill: false,
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ) : null,
            )}
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
