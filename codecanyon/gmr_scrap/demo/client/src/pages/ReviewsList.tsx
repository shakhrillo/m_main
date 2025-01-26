import {
  IconCheck,
  IconMessageReply,
  IconMessages,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react"; // React imports for state and effect handling
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  Row,
  Stack,
  Table,
} from "react-bootstrap";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { StatusInfo } from "../components/StatusInfo";
import { dockerContainers } from "../services/dockerService";
import { userData } from "../services/userService";
import { IDockerContainer } from "../types/dockerContainer";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { ContainersList } from "../components/containers/ContainersList";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const ReviewsList = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [containers, setContainers] = useState<IDockerContainer[]>([]);
  // const [reviews, setReviews] = useState<IReview[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "All comments",
      icon: IconCheck,
      // value: containers.totalReviews || "0",
    },
    {
      label: "Owner responses",
      icon: IconMessageReply,
      // value: containers.totalOwnerReviews || "0",
    },
    {
      label: "Videos",
      icon: IconMessages,
      // value: containers.totalVideos || "0",
    },
    {
      label: "Images",
      icon: IconPhoto,
      // value: containers.totalImages || "0"
    },
  ];

  useEffect(() => {
    const reviewSubscription = dockerContainers({
      search,
      uid: uid,
      type: "comments",
    }).subscribe((data) => {
      setContainers(data);
    });

    return () => {
      reviewSubscription.unsubscribe();
    };
  }, [search, uid]);

  useEffect(() => {
    const statsSubscription = userData(uid).subscribe((data) => {
      // setInfo(data);
    });

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {/*---Extracted reviews status---*/}
        {/* {stats.map((stat, index) => (
          <Col key={index}>
            <Statistics {...stat} />
          </Col>
        ))} */}
        {/*---End: Extracted reviews status---*/}

        {/* Table for displaying reviews based on active filter */}
        <Col xs={12}>
          <ContainersList type="comments" path="reviews" />
        </Col>
      </Row>
    </Container>
  );
};
