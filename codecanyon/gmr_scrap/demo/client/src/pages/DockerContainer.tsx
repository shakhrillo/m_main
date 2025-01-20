import { IconSearch } from "@tabler/icons-react";
import { User } from "firebase/auth";
import { createElement, useEffect, useState } from "react"; // React imports for state and effect handling
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
import { useNavigate, useOutletContext, useParams } from "react-router-dom"; // Hook for navigation
import {
  dockerContainer,
  dockerContainerStats,
} from "../services/dockerService";
import { userData } from "../services/userService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { formatSize } from "../utils/formatSize";
import { LineChart } from "../components/LineChart";
import { DockerContainerDetails } from "../components/DockerContainerDetails";
import { formatDate } from "../utils/formatDate";
import { formatStringDate } from "../utils/formatStringDate";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "error", label: "Failed" },
];

export const DockerContainer = () => {
  const { uid } = useOutletContext<User>();
  const navigate = useNavigate();
  const { containerId } = useParams() as { containerId: string };

  const [info, setInfo] = useState<any>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const containersSubscription = dockerContainerStats(containerId).subscribe(
      (data) => {
        // console.log("stats->", data);
        setStats(data);
        setLoading(false);
      },
    );

    return () => {
      containersSubscription.unsubscribe();
    };
  }, [search, uid, filter]);

  useEffect(() => {
    const statsSubscription = userData(uid).subscribe((data) => {
      setInfo(data);
    });

    return () => {
      statsSubscription.unsubscribe();
    };
  }, [uid]);

  return (
    <Container>
      <Row className="g-3">
        <Col md={9}>
          <Row className="g-3 row-cols-1">
            {[
              {
                label: "CPU",
                data: stats.map((stat) =>
                  // const nsToSec = (ns) => (ns / 1e9).toFixed(2);
                  formatSize(
                    stat?.cpu_stats?.cpu_usage?.total_usage / 1e9,
                    "num",
                  ),
                ),
                color: "#3e2c41",
              },
              {
                label: "Memory",
                data: stats.map((stat) =>
                  formatSize(stat?.memory_stats?.usage, "num"),
                ),
                color: "#ff4c30",
              },
              {
                label: "Network",
                data: stats.map((stat) =>
                  formatSize(
                    stat?.networks?.eth0?.rx_bytes +
                      stat?.networks?.eth0?.tx_bytes,
                    "num",
                  ),
                ),
                color: "#825e5c",
              },
            ].map((stat) => (
              <Col key={stat.label}>
                <Card>
                  <CardHeader>
                    <span className="fw-bold fs-5 text-decoration-none">
                      {stat.label}
                    </span>
                  </CardHeader>
                  <CardBody>
                    <LineChart
                      labels={stats.map((stat) =>
                        formatStringDate(stat?.read, "HH:mm:ss"),
                      )}
                      datasets={[stat]}
                    />
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={3}>
          <DockerContainerDetails containerId={containerId} />
        </Col>
      </Row>
    </Container>
  );
};
