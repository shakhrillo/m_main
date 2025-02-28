import { useEffect, useState, useCallback, useMemo } from "react";
import { Row, Col, Stack } from "react-bootstrap";
import { IconCircleFilled } from "@tabler/icons-react";
import { formatNumber } from "../../utils/formatNumber";
import { DoughnutChart } from "../DoughnutChart";
import { getStatistics } from "../../services/statistics";

const INITIAL_CONTAINERS = [
  { id: "info", title: "Validated", colorClass: "text-primary", bgClass: "bg-primary-subtle" },
  { id: "comments", title: "Scraped", colorClass: "text-success", bgClass: "bg-success-subtle" },
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
        <Row className="g-3">
          <Col md={6} className="d-flex flex-column justify-content-end">
            {containers.map(({ id, title, total, colorClass }) => (
              <Stack key={id} direction="horizontal" gap={2} className="mt-2">
                <IconCircleFilled size={20} strokeWidth={1} className={colorClass} />
                <span className="text-capitalize">
                  {title} ({formatNumber(total)})
                </span>
              </Stack>
            ))}
          </Col>
          <Col md={6}>
            <DoughnutChart data={containers.map(({ total }) => total)} total={totalValue} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
