import { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { LineChart } from "../components/LineChart";
import { PlaceInfo } from "../components/place/PlaceInfo";
import {
  dockerContainers,
  dockerContainerStats,
} from "../services/dockerService";
import type { IDockerStats } from "../types/dockerStats";
import { formatSize } from "../utils/formatSize";
import { formatStringDate } from "../utils/formatStringDate";
import { filter, map } from "rxjs";
import type { IDockerContainer } from "../types/dockerContainer";
import { ContainerLogs } from "../components/containers/ContainerLogs";
import type { IUserInfo } from "../types/userInfo";
import { ContainerScreenshots } from "../components/containers/ContainerScreenshots";

const CHART_COLORS = {
  cpu: "#043b5c",
  memory: "#043b5c",
  networkDownload: "#b2de27",
  networkUpload: "#043b5c",
  pids: "#043b5c",
};

/**
 * Docker container page component.
 */
export const DockerContainer = () => {
  const navigate = useNavigate();
  const user = useOutletContext<IUserInfo>();
  const { containerId } = useParams<{ containerId: string }>();
  const [stats, setStats] = useState<IDockerStats[]>([]);
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!containerId || !user?.uid) return;

    const subscription = dockerContainers({
      containerId,
      ...(user?.isAdmin ? {} : { uid: user.uid }),
    })
      .pipe(
        filter(Boolean),
        map(
          (snapshot) =>
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as IDockerContainer),
            }))[0],
        ),
      )
      .subscribe(setContainer);

    return () => subscription.unsubscribe();
  }, [containerId, user]);

  useEffect(() => {
    if (!containerId) return;

    const subscription = dockerContainerStats(containerId).subscribe({
      next: setStats,
      error: (error) => console.error("Error fetching stats:", error),
    });

    return () => subscription.unsubscribe();
  }, [containerId]);

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
            color: CHART_COLORS.cpu,
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
            color: CHART_COLORS.memory,
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
            color: CHART_COLORS.networkDownload,
          },
          {
            label: "Uploaded Data",
            data: stats.map((stat) =>
              Number(formatSize(stat?.networks?.eth0?.tx_bytes ?? 0, "num")),
            ),
            color: CHART_COLORS.networkUpload,
          },
        ],
      },
      {
        label: "PIDs",
        datasets: [
          {
            label: "PIDs Count",
            data: stats.map((stat) => stat?.pids_stats?.current ?? 0),
            color: CHART_COLORS.pids,
          },
        ],
      },
    ],
    [stats],
  );

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/containers")}>
          Containers
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{container?.title || "N/A"}</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
        <Col md={9}>
          <Tabs variant="pills" defaultActiveKey="stats">
            <Tab eventKey="stats" title="Stats">
              <Row className="g-3">
                {chartData.map((chart) => (
                  <Col key={chart.label} sm={12}>
                    <div className="docker-title">{chart.label}</div>
                    <div className="docker-graph">
                      <LineChart labels={labels} datasets={chart.datasets} />
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab>
            <Tab eventKey="logs" title="Logs">
              <ContainerLogs containerId={containerId} />
            </Tab>
            <Tab eventKey="screenshots" title="Screenshots">
              <ContainerScreenshots containerId={containerId} />
            </Tab>
          </Tabs>
        </Col>
        <Col md={3}>
          <PlaceInfo container={container} />
        </Col>
      </Row>
    </Container>
  );
};
