import { IconMessageReply, IconMessages, IconPhoto } from "@tabler/icons-react";
import { User } from "firebase/auth";
import React, { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
import { useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import {
  IComment,
  IReview,
  scrapStatistics,
  validatedUrls,
} from "../services/scrapService";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { spentTime } from "../utils/spentTime"; // Utility for calculating spent time
import {
  Tabs,
  Tab,
  Table,
  Card,
  Col,
  Stack,
  Container,
  Row,
} from "react-bootstrap";
import { userData } from "../services/userService";
import { StatusInfo } from "../components/StatusInfo";
import formatNumber from "../utils/formatNumber";

export const ReviewsList = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  // States for managing dashboard data
  const [info, setInfo] = useState<any>({});
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [activeTableFilter, setActiveTableFilter] = useState("all"); // Active table filter

  const stats = [
    {
      label: "All comments",
      icon: IconMessages,
      value: info.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      value: info.totalOwnerReviews || "0",
    },
    {
      label: "User comments",
      icon: IconMessages,
      value: info.totalUserReviews || "0",
    },
    { label: "Images", icon: IconPhoto, value: info.totalImages || "0" },
  ];

  useEffect(() => {
    const reviewSubscription = validatedUrls(uid, "comments").subscribe(
      (data) => {
        setReviews(data);
        setLoading(false);
      },
    );

    const statsSubscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      reviewSubscription.unsubscribe();
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container fluid>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row className="g-3">
          {/*---Extracted reviews status---*/}
          {stats.map((stat, index) => (
            <Col key={index} md={3}>
              <Card>
                <Card.Body>
                  <Stack direction="horizontal" gap={3}>
                    {createElement(stat.icon, { size: 48, strokeWidth: 1.5 })}
                    <Stack direction="vertical">
                      <Card.Title className="fs-3 m-0">
                        {formatNumber(stat.value)}
                      </Card.Title>
                      <Card.Text>{stat.label}</Card.Text>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {/*---End: Extracted reviews status---*/}

          {/* Table for displaying reviews based on active filter */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <Table hover>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Title</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={index}>
                        <td scope="row" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td style={{ width: "130px" }}>
                          <StatusInfo info={review} />
                        </td>
                        <td>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/reviews/${review.id}`);
                            }}
                          >
                            {review.title}
                          </a>
                        </td>
                        <td style={{ width: "250px" }}>
                          {formatTimestamp(review.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Row>
      )}
    </Container>
  );
};
