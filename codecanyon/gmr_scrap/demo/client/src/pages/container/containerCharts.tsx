import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Col } from "react-bootstrap";
import { LineChart } from "../../components/LineChart";
import { dockerContainerStats } from "../../services/dockerService";
import { IDockerStats } from "../../types/dockerStats";
import { formatSize } from "../../utils/formatSize";
import { formatStringDate } from "../../utils/formatStringDate";

export const ContainerCharts = ({
  containerId,
}: {
  containerId: string | undefined;
}) => {
  const [stats, setStats] = useState<IDockerStats[]>([]);

  // Memoized labels for the chart
  const labels = useMemo(
    () => stats.map((stat) => formatStringDate(stat?.read ?? "", "HH:mm:ss")),
    [stats],
  );

  // Memoized chart data
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

    // Fetch container stats
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

  return chartData.map((chart) => (
    <Col key={chart.label}>
      <Card>
        <CardHeader>
          <span className="fw-bold fs-5">{chart.label}</span>
        </CardHeader>
        <CardBody>
          <LineChart labels={labels} datasets={chart.datasets} />
        </CardBody>
      </Card>
    </Col>
  ));
};
