import { useEffect, useState, useCallback, useMemo } from "react";
import { Row, Col, Stack } from "react-bootstrap";
import { IconCircleFilled } from "@tabler/icons-react";
import { formatNumber } from "../../utils/formatNumber";
import { DoughnutChart } from "../DoughnutChart";
import { getStatistics } from "../../services/statistics";

const INITIAL_CONTAINERS = [
  { id: "info", title: "Validated", colorClass: "#ecd9dd", bgClass: "bg-primary-subtle" },
  { id: "comments", title: "Scraped", colorClass: "#c9f29b", bgClass: "bg-success-subtle" },
];

export const StatisticsDoughnut = () => {
  const [containers, setContainers] = useState(
    INITIAL_CONTAINERS.map((item) => ({ ...item, total: 0 }))
  );

  const updateStatistics = useCallback(() => {
    const subscriptions = containers.map((container, index) =>
      getStatistics(container.id).subscribe((data) => {
        setContainers((prev) =>
          prev.map((item, i) => (i === index ? { ...item, total: data.total } : item))
        );
      })
    );

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, [containers]);

  useEffect(updateStatistics, []);

  const totalValue = useMemo(
    () => containers.reduce((sum, { total }) => sum + total, 0),
    [containers]
  );

  return (
    <div>
      <h4 className="dashboard-title">Statistics</h4>
      <div className="dashboard-graph">
        {containers.map(({ id, title, total, colorClass }) => (
          <Stack key={id} direction="horizontal" gap={2} className="mt-2">
            <IconCircleFilled fill={colorClass} />
            <span className="text-capitalize">
              {title} ({formatNumber(total)})
            </span>
          </Stack>
        ))}
        <DoughnutChart data={containers.map(({ total }) => total)} total={totalValue} />
      </div>
    </div>
  );
};
