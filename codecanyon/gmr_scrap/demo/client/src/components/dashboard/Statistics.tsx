import { IconCircleFilled } from "@tabler/icons-react"
import { Card, Row, Col, Stack } from "react-bootstrap"
import formatNumber from "../../utils/formatNumber"
import { DoughnutChart } from "../DoughnutChart"
import { useState } from "react"

export const Statistics = () => {
    const [containers, setContainers] = useState([
        {
            title: "Validated",
            total: 3,
            backgroundColor: "bg-primary-subtle",
            color: "text-primary",
        },
        {
            title: "Scraped",
            total: 1,
            backgroundColor: "bg-success-subtle",
            color: "text-success",
        },
    ]);

    return (
        <Card>
            <Card.Body className="d-flex flex-column">
                <Card.Title>Statistics</Card.Title>
                <Row className="g-3">
                    <Col md={6}>
                        <div className="h-100 d-flex gap-2 align-items-end">
                            {containers.map((item, index) => (
                                <div className="d-inline">
                                    <Stack key={index} direction="horizontal" gap={2}>
                                        <IconCircleFilled
                                            size={20}
                                            strokeWidth={1}
                                            className={item.color}
                                        />
                                        <span className="text-capitalize">
                                            {item.title} ({formatNumber(item.total)})
                                        </span>
                                    </Stack>
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Col md={6}>
                        <DoughnutChart
                            data={containers.map((e) => e.total)}
                            total={containers.reduce((acc, e) => acc + e.total, 0)}
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}