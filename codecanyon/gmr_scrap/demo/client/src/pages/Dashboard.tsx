import {
  IconArrowDown,
  IconArrowUp,
  IconCircle,
  IconCircle1,
  IconCircleFilled,
  IconMapPinFilled,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import L, { point } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DoughnutChart } from "../components/DoughnutChart";
import { LineChart } from "../components/LineChart";
import { IReview, validatedUrls } from "../services/scrapService";
import {
  allContainers,
  allUsers,
  appStatistics,
  totalEarnings,
} from "../services/settingService";
import { formatTotalEarnings } from "../utils/formatTotalEarnings";
import { formatTotalUsers } from "../utils/formatTotalUsers";
import { Map } from "../components/Map";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { checkEarningsTrend } from "../utils/checkEarningsTrend";
import formatNumber from "../utils/formatNumber";
import { GoogleMap } from "../components/GoogleMap";

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
    [] as { latitude: number; longitude: number }[],
  );
  const [earnings, setEarnings] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [containers, setContainers] = useState([] as any[]);
  const [statistics, setStatistics] = useState({} as any);

  useEffect(() => {
    const appStatisticsSubscription = appStatistics().subscribe((data) => {
      setStatistics(data);
    });

    const containersSubscription = allContainers().subscribe((data) => {
      const totalImages = data.reduce(
        (acc: number, e: any) => acc + (e.totalImages || 0),
        0,
      );
      const totalOwnerReviews = data.reduce(
        (acc: number, e: any) => acc + (e.totalOwnerReviews || 0),
        0,
      );
      const totalReviews = data.reduce(
        (acc: number, e: any) => acc + (e.totalReviews || 0),
        0,
      );
      const totalVideos = data.reduce(
        (acc: number, e: any) => acc + (e.totalVideos || 0),
        0,
      );

      setContainers([
        totalImages,
        totalVideos,
        totalReviews,
        totalOwnerReviews,
      ]);

      const locations = data.map((container: any) => {
        return {
          latitude: container.location?.latitude,
          longitude: container.location?.longitude,
        };
      });

      console.log("locations", locations);

      setMarkerLocations(locations);
    });

    const earningsSubscription = totalEarnings().subscribe((data) => {
      setEarnings(formatTotalEarnings(data));
    });

    const usersSubscription = allUsers().subscribe((data) => {
      console.log("users", formatTotalUsers(data));
      setUsers(formatTotalUsers(data));
    });

    // const commentsSubscription = validatedUrls(uid, {
    //   type: "info",
    // }).subscribe((data) => {
    //   setReviews(data);

    //   const locations = data
    //     .filter(
    //       (review) =>
    //         review.location &&
    //         review.location.latitude &&
    //         review.location.longitude,
    //     )
    //     .map((review) => {
    //       console.log("review", review);
    //       return [review.location?.latitude, review.location?.longitude] as [
    //         number,
    //         number,
    //       ];
    //     });

    //   console.log("locations", locations);

    //   setMarkerLocations(locations);
    // });

    return () => {
      appStatisticsSubscription.unsubscribe();
      earningsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
      containersSubscription.unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Row className="g-3">
        <Col md={6}>
          <Card id="dashboard">
            <Card.Body>
              <Card.Title>Total revenue</Card.Title>
              <LineChart
                labels={earnings.map((e) => e.date)}
                datasets={[
                  {
                    label: "Total revenue",
                    data: earnings.map((e) => e.total),
                    borderColor: "#3e2c41",
                    // backgroundColor: "rgba(62, 44, 65, 0.1)",
                    borderWidth: 2,
                    pointRadius: 2,
                    pointBackgroundColor: "#3e2c41",
                    tension: 0.2,
                    fill: true,
                    backgroundColor: (context: any) => {
                      const { chart } = context;
                      const { ctx, chartArea } = chart;

                      // Check if chartArea is defined to avoid rendering issues during animation
                      if (!chartArea) {
                        return;
                      }

                      const { top, bottom } = chartArea;

                      // Create a linear gradient
                      const gradient = ctx.createLinearGradient(
                        0,
                        top,
                        0,
                        bottom,
                      );
                      gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
                      gradient.addColorStop(1, "rgba(62, 44, 65, 0)");

                      return gradient;
                    },
                  },
                ]}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Row className="row-cols-1 g-3">
            <Col>
              <Card>
                <Row>
                  <Col sm={7} className="d-flex">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>Statistics</Card.Title>
                      <Row className="mt-auto row-cols-2 g-2">
                        {[
                          {
                            title: "Images",
                            total: containers[0],
                            backgroundColor: "bg-primary-subtle",
                            color: "text-primary",
                          },
                          {
                            title: "Videos",
                            total: containers[1],
                            backgroundColor: "bg-success-subtle",
                            color: "text-success",
                          },
                          {
                            title: "Reviews",
                            total: containers[2],
                            backgroundColor: "bg-info-subtle",
                            color: "text-info",
                          },
                          {
                            title: "Responses",
                            total: containers[3],
                            backgroundColor: "bg-warning-subtle",
                            color: "text-warning",
                          },
                        ].map((item, index) => (
                          <Col key={index}>
                            <IconCircleFilled
                              size={20}
                              strokeWidth={1}
                              className={item.color}
                            />
                            <span className="text-capitalize ms-2">
                              {item.title}
                            </span>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Col>
                  <Col sm={5}>
                    <DoughnutChart
                      data={containers}
                      total={containers.reduce((acc, e) => acc + e, 0)}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Earnings</Card.Title>
                  <div className="fs-1">
                    ${formatNumber((statistics?.earnings || 0) / 100)}
                  </div>
                  <small className="mt-auto">
                    {checkEarningsTrend(earnings)}%{" "}
                    {checkEarningsTrend(earnings) > 0 ? "increase" : "decrease"}{" "}
                    in revenue since last month
                  </small>
                  <div className="position-absolute p-1 top-0 end-0 mt-2 me-2 rounded bg-light">
                    {checkEarningsTrend(earnings) > 0 ? (
                      <IconTrendingUp size={24} className="text-success" />
                    ) : (
                      <IconTrendingDown size={24} className="text-danger" />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Card style={{ height: "400px" }}>
            <GoogleMap locations={markerLocations} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
