import { useEffect, useState } from "react";
import { Row, Col, Stack } from "react-bootstrap";
import { IconCircleFilled } from "@tabler/icons-react";
import { formatNumber } from "../../utils/formatNumber";
import { DoughnutChart } from "../DoughnutChart";
import { getStatistics } from "../../services/statistics";

const INITIAL_CONTAINERS = [
  { id: "info", title: "Validated", total: 3, colorClass: "text-primary", bgClass: "bg-primary-subtle" },
  { id: "comments", title: "Scraped", total: 1, colorClass: "text-success", bgClass: "bg-success-subtle" },
];

export const StatisticsDoughnut = () => {
  const [containers, setContainers] = useState(INITIAL_CONTAINERS);

  useEffect(() => {
    const subscriptions = containers.map((container, index) =>
      getStatistics(container.id).subscribe((data) => {
        setContainers((prev) => {
          const updatedContainers = [...prev];
          updatedContainers[index] = { ...prev[index], total: data.total };
          return updatedContainers;
        });
      })
    );

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, []);

  return (
    <>
      <div className="dashboard-title">
        Statistics
      </div>
      <div className="dashboard-graph">
        <Row className="g-3">
          <Col md={6} className="d-flex flex-column justify-content-end">
            {containers.map(({ id, title, total, colorClass }, index) => (
              <Stack key={id} direction="horizontal" gap={2} className="mt-2">
                <IconCircleFilled size={20} strokeWidth={1} className={colorClass} />
                <span className="text-capitalize">{title} ({formatNumber(total)})</span>
              </Stack>
            ))}
          </Col>
          <Col md={6}>
            <DoughnutChart
              data={containers.map(({ total }) => total)}
              total={containers.reduce((acc, { total }) => acc + total, 0)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
