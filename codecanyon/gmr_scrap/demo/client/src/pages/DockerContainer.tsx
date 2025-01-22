import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { filter, map } from "rxjs";
import { LineChart } from "../components/LineChart";
import { PlaceInfo } from "../components/place/PlaceInfo";
import {
  dockerContainers,
  dockerContainerStats,
} from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { IDockerStats } from "../types/dockerStats";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";

export const DockerContainer = () => {
  const { containerId } = useParams<{ containerId: string }>();
  const [stats, setStats] = useState<IDockerStats[]>([]);
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const containerStatsSubscription = dockerContainerStats(
      containerId,
    ).subscribe({
      next: (data) => {
        setStats(data);
      },
      error: (error) => console.error("Error fetching stats data:", error),
    });

    const containerSubscription = dockerContainers({ containerId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      containerStatsSubscription.unsubscribe();
      containerSubscription.unsubscribe();
    };
  }, [containerId]);

  const chartData = [
    {
      label: "CPU",
      datasets: [
        {
          label: "Usage (GHz)",
          data: stats.map((stat) =>
            Number(
              formatSize(
                stat?.cpu_stats?.cpu_usage?.total_usage ?? 0 / 1e9,
                "num",
              ),
            ),
          ),
          color: "#3e2c41",
        },
      ],
    },
    {
      label: "Memory",
      datasets: [
        {
          label: "Usage (GB)",
          data: stats.map((stat) =>
            Number(formatSize(stat?.memory_stats?.usage ?? 0, "num")),
          ),
          color: "#ff4c30",
        },
      ],
    },
    {
      label: "Network",
      datasets: [
        {
          label: "Downloaded Data",
          data: stats.map((stat) =>
            Number(formatSize(stat?.networks?.eth0?.rx_bytes ?? 0, "num")),
          ),
          color: "#e33d94",
        },
        {
          label: "Uploaded Data",
          data: stats.map((stat) =>
            Number(formatSize(stat?.networks?.eth0?.tx_bytes ?? 0, "num")),
          ),
          color: "#825e5c",
        },
      ],
    },
    {
      label: "PIDs",
      datasets: [
        {
          label: "PIDs Count",
          data: stats.map((stat) => stat?.pids_stats?.current ?? 0),
          color: "#5a228b",
        },
      ],
    },
  ];

  return (
    <Container>
      <Row className="g-3">
        <Col md={8}>
          <Row className="g-3 row-cols-1">
            {chartData.map((chart) => (
              <Col key={chart.label}>
                <Card>
                  <CardHeader>
                    <span className="fw-bold fs-5">{chart.label}</span>
                  </CardHeader>
                  <CardBody>
                    <LineChart
                      labels={stats.map((stat) =>
                        formatStringDate(stat?.read ?? "", "HH:mm:ss"),
                      )}
                      datasets={chart.datasets}
                    />
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={4}>
          <PlaceInfo containerId={containerId || ""} container={container} />
        </Col>
      </Row>
    </Container>
  );
};
