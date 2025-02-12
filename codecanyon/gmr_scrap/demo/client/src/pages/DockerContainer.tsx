import { IconReload } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { LineChart } from "../components/LineChart";
import { PlaceInfo } from "../components/place/PlaceInfo";
import {
  dockerContainerLogs,
  dockerContainerStats,
} from "../services/dockerService";
import { IDockerStats } from "../types/dockerStats";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";

export const DockerContainer = () => {
  const navigate = useNavigate();
  const { containerId } = useParams<{ containerId: string }>();

  const [stats, setStats] = useState<IDockerStats[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

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

    const subscription = dockerContainerStats(containerId).subscribe({
      next: (data) => {
        console.log(data);
        setStats(data);
      },
      error: (error) => console.error("Error fetching stats data:", error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const subscription = dockerContainerLogs(containerId).subscribe({
      next: (data) => {
        console.log(data);
        if (!data || data.length === 0) {
          return;
        }

        setLogs(data.map(({ logs }: { logs: string }) => logs));
      },
      error: (error) => console.error("Error fetching logs data:", error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item>Docker</Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/containers");
          }}
        >
          Containers
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{containerId || "N/A"}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
        <Col md={9}>
          <Tabs defaultActiveKey="stats" className="mb-3">
            <Tab eventKey="stats" title="Stats">
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
            </Tab>
            <Tab eventKey="logs" title="Logs">
              <Card>
                <CardBody>
                  <pre>{logs.join("\n")}</pre>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </Col>
        <Col md={3}>
          <PlaceInfo containerId={containerId} />
        </Col>
      </Row>
    </Container>
  );
};
