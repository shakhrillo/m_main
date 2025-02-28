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

const cpuChartColor = "#043b5c";
const memoryChartColor = "#043b5c";
const networkChartDownloadedColor = "#b2de27";
const networkChartUploadedColor = "#043b5c";
const pidsChartColor = "#043b5c";

export const DockerContainer = () => {
  const navigate = useNavigate();
  const user = useOutletContext<IUserInfo>();
  const { containerId } = useParams<{ containerId: string }>();

  const [stats, setStats] = useState<IDockerStats[]>([]);
  // const [logs, setLogs] = useState<string[]>([]);

  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!containerId || !user?.uid) {
      setContainer({} as IDockerContainer);
      return;
    }

    console.log("containerId", containerId);
    console.log("user?.uid", user?.uid);

    const subscription = dockerContainers({
      containerId: containerId,
      ...(user?.isAdmin ? {} : { uid: user?.uid }),
      // uid: auth.currentUser?.uid,
    })
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) => {
          const containers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IDockerContainer),
          }));
          return containers[0];
        }),
      )
      .subscribe((data) => {
        console.log("data", data);
        if (!data || !data.location) {
          setContainer({} as IDockerContainer);
          return;
        }
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId, user]);

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
            color: cpuChartColor,
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
            color: memoryChartColor,
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
            color: networkChartDownloadedColor,
          },
          {
            label: "Uploaded Data",
            data: stats.map((stat) =>
              Number(formatSize(stat?.networks?.eth0?.tx_bytes ?? 0, "num")),
            ),
            color: networkChartUploadedColor,
          },
        ],
      },
      {
        label: "PIDs",
        datasets: [
          {
            label: "PIDs Count",
            data: stats.map((stat) => stat?.pids_stats?.current ?? 0),
            color: pidsChartColor,
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

  // useEffect(() => {
  //   if (!containerId) {
  //     return;
  //   }

  //   const subscription = dockerContainerLogs(containerId).subscribe({
  //     next: (data) => {
  //       if (!data || data.length === 0) {
  //         return;
  //       }

  //       setLogs(data.map(({ logs }: { logs: string }) => logs));
  //     },
  //     error: (error) => console.error("Error fetching logs data:", error),
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [containerId]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            navigate("/containers");
          }}
        >
          Containers
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{container.title || "N/A"}</Breadcrumb.Item>
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
          </Tabs>
        </Col>
        <Col md={3}>
          <PlaceInfo container={container} />
        </Col>
      </Row>
    </Container>
  );
};
