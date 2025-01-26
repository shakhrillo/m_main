import { IconInfoCircle, IconSearch } from "@tabler/icons-react";
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
import { useNavigate, useOutletContext } from "react-router-dom"; // Hook for navigation
import { Statistics } from "../components/Statistics";
import { StatusInfo } from "../components/StatusInfo";
import { IReview, validatedUrls } from "../services/scrapService";
import { userData } from "../services/userService";
import { formatTimestamp } from "../utils/formatTimestamp"; // Utility to format timestamps
import { dockerContainers } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { ContainersList } from "../components/containers/ContainersList";
const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];
export const ValidatedURLs = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();

  const [info, setInfo] = useState<any>({});
  const [reviews, setReviews] = useState<IDockerContainer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const stats = [
    {
      label: "Total Validates",
      icon: IconInfoCircle,
      value: info.totalValidateInfo || "0",
    },
  ];

  useEffect(() => {
    const subscription = dockerContainers({
      type: "info",
    }).subscribe((data) => {
      setReviews(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [search, uid, filter]);

  useEffect(() => {
    const subscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        {/* Table for displaying reviews based on active filter */}
        <Col xs={12}>
          <ContainersList path="scrap" type="info" />
        </Col>
      </Row>
    </Container>
  );
};
