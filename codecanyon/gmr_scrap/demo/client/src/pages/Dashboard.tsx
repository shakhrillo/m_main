import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GoogleMap } from "../components/GoogleMap";
import { RevenueGraph, StatisticsDoughnut, EraningsTotal, UsersGraph, UsersTotal } from "../components/dashboard";
import { allContainersByGeoBounds } from "../services/settingService";
import { locationsToGeoJSON } from "../utils/locationsToGeoJSON";
import { BehaviorSubject, debounceTime, distinctUntilChanged, skip, skipWhile } from "rxjs";
const boundChanges$ = new BehaviorSubject<google.maps.LatLngBounds | null>(null);

/**
 * Dashboard page component.
 * @returns JSX.Element
 */
export const Dashboard = () => {
  const [geojson, setGeojson] = useState<any>({ type: "FeatureCollection", features: [] });

  useEffect(() => {
    const subscription = boundChanges$.pipe(
      skip(1),
      skipWhile((bounds) => bounds === null),
      distinctUntilChanged((prev, curr) => prev?.toJSON() === curr?.toJSON()),
      debounceTime(600)
    ).subscribe((bounds) => {
      if (!bounds) return;

      allContainersByGeoBounds(bounds).then((data: any) => {
        setGeojson(locationsToGeoJSON(data.map((container: any) => container.location)));
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Container>
      <Row className="g-3">
        <Col md={6}><RevenueGraph /></Col>
        <Col md={6}><UsersGraph /></Col>
        <Col md={4}><StatisticsDoughnut /></Col>
        <Col md={4}><EraningsTotal /></Col>
        <Col md={4}><UsersTotal /></Col>
        <Col md={12}>
          <div className="dashboard-title">
            Map of all containers
          </div>
          <div className="dashboard-map">
            <GoogleMap geojson={geojson} boundChanges={boundChanges$} isFitBounds={false} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
