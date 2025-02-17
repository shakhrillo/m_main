import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Container, Row } from "react-bootstrap";
import { GoogleMap } from "../components/GoogleMap";
import { RevenueGraph, StatisticsDoughnut, EraningsTotal, UsersGraph, UsersTotal } from "../components/dashboard";
import { allContainers } from "../services/settingService";
import { locationsToGeoJSON } from "../utils/locationsToGeoJSON";

/**
 * Dashboard page component.
 * @returns JSX.Element
 */
export const Dashboard = () => {
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
          <Card>
            <Card.Body>
              <Card.Title>
                This month's container locations
              </Card.Title>
              {geojson && <GoogleMap geojson={geojson} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
