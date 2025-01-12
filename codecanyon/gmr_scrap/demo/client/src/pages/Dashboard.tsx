import {
  IconArrowUp,
  IconCircle,
  IconCircle1,
  IconCircleFilled,
  IconMapPinFilled,
  IconTrendingUp,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import L from "leaflet";
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
      console.log("data", data);
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

      console.log("d", [
        totalImages,
        totalVideos,
        totalReviews,
        totalOwnerReviews,
      ]);

      setContainers([
        totalImages,
        totalVideos,
        totalReviews,
        totalOwnerReviews,
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
    <Container fluid>
      <Row className="g-3">
        <Col md={4}>
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
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Earnings</Card.Title>
              <div className="fs-1">
                ${earnings.reduce((acc, e) => acc + e.total, 0)}2.222.3
              </div>
              <small className="mt-auto">24% increase from last month</small>
              <div className="position-absolute p-1 top-0 end-0 bg-success-subtle mt-2 me-2 rounded">
                <IconTrendingUp size={24} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Users</Card.Title>
              <div className="fs-1">
                ${users.reduce((acc, e) => acc + e.total, 0)}2.222.3
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Map locations={markerLocations} />
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ height: "400px" }} className="overflow-auto">
            <Card.Body>
              <Table striped bordered hover responsive>
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
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
