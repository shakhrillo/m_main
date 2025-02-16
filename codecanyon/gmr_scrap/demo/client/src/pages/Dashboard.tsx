import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { GoogleMap } from "../components/GoogleMap";
import { RevenueGraph } from "../components/dashboard/RevenueGraph";
import { StatisticsDoughnut } from "../components/dashboard/StatisticsDoughnut";
import { EraningsTotal } from "../components/dashboard/EraningsTotal";
import { UsersGraph } from "../components/dashboard/UsersGraph";
import { UsersTotal } from "../components/dashboard/UsersTotal";
import { allContainers } from "../services/settingService";
import { locationsToGeoJSON } from "../utils/locationsToGeoJSON";

export const Dashboard: React.FC = () => {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    const subscription = allContainers().subscribe((data) => {
      setGeojson(locationsToGeoJSON(data.map((container: any) => container.location)));
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="g-3">
        <Col md={6}><RevenueGraph /></Col>
        <Col md={6}><UsersGraph /></Col>
        <Col md={4}><StatisticsDoughnut /></Col>
        <Col md={4}><EraningsTotal /></Col>
        <Col md={4}><UsersTotal /></Col>
        <Col md={12}>
          <Card style={{ height: "400px" }}>
            {geojson && <GoogleMap geojson={geojson} />}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
