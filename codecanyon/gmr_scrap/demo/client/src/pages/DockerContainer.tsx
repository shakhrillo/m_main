import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useOutletContext, useParams } from "react-router-dom";
import { DockerContainerDetails } from "../components/DockerContainerDetails";
import { LineChart } from "../components/LineChart";
import { dockerContainerStats } from "../services/dockerService";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";

export const DockerContainer = () => {
  const { uid } = useOutletContext<User>();
  const { containerId } = useParams() as { containerId: string };

  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const subscription = dockerContainerStats(containerId).subscribe((data) =>
      setStats(data),
    );

    return () => {
      subscription.unsubscribe();
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
                data: [
                  {
                    label: "Usage (GHz)",
                    data: stats.map((stat) =>
                      formatSize(
                        stat?.cpu_stats?.cpu_usage?.total_usage / 1e9, // Convert to GHz
                        "num",
                      ),
                    ),
                    color: "#3e2c41",
                  },
                ],
              },
              {
                label: "Memory",
                data: [
                  {
                    label: "Usage (GB)",
                    data: stats.map(
                      (stat) => formatSize(stat?.memory_stats?.usage, "num"), // Convert to readable size
                    ),
                    color: "#ff4c30",
                  },
                ],
              },
              {
                label: "Network",
                data: [
                  {
                    label: "Downloaded Data",
                    data: stats.map((stat) =>
                      formatSize(stat?.networks?.eth0?.rx_bytes, "num"),
                    ),
                    color: "#e33d94",
                  },
                  {
                    label: "Uploaded Data",
                    data: stats.map((stat) =>
                      formatSize(stat?.networks?.eth0?.tx_bytes, "num"),
                    ),
                    color: "#825e5c",
                  },
                ],
              },
              {
                label: "PIDs",
                data: [
                  {
                    label: "PIDs Count",
                    data: stats.map((stat) => stat?.pids_stats?.current),
                    color: "#5a228b",
                  },
                ],
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
                      datasets={stat.data}
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
