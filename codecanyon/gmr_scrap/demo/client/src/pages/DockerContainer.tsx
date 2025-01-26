import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Stack,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { PlaceInfo } from "../components/place/PlaceInfo";
import { useState, useMemo, useEffect } from "react";
import { LineChart } from "../components/LineChart";
import { dockerContainerStats } from "../services/dockerService";
import { IDockerStats } from "../types/dockerStats";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";
import { IconDownload, IconReload, IconZoomIn } from "@tabler/icons-react";

export const DockerContainer = () => {
  const { containerId } = useParams<{ containerId: string }>();

  const [stats, setStats] = useState<IDockerStats[]>([]);

  const labels = useMemo(
    () => stats.map((stat) => formatStringDate(stat?.read ?? "", "HH:mm:ss")),
    [stats],
  );

  const chartData = useMemo(
    () => [
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
    ],
    [stats],
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

    return () => {
      containerStatsSubscription.unsubscribe();
    };
  }, [containerId]);

  return (
    <Container>
      <Row className="g-3">
        <Col md={9}>
          <Row className="g-3 row-cols-1">
            {chartData.map((chart) => (
              <Col key={chart.label}>
                <Card>
                  <CardBody>
                    <Stack direction="horizontal" gap={3} className="mb-3">
                      <span className="fw-bold fs-5 me-auto">
                        {chart.label}
                      </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() =>
                          setStats(stats.map((stat) => ({ ...stat })))
                        }
                      >
                        <IconReload />
                      </Button>
                    </Stack>
                    <LineChart labels={labels} datasets={chart.datasets} />
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={3}>
          <PlaceInfo containerId={containerId} />
        </Col>
      </Row>
    </Container>
  );
};
