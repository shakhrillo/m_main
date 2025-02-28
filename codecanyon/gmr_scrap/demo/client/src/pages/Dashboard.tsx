import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GoogleMap } from "../components/GoogleMap";
import { RevenueGraph, EraningsTotal, UsersTotal } from "../components/dashboard";
import { allContainersByGeoBounds } from "../services/settingService";
import { locationsToGeoJSON } from "../utils/locationsToGeoJSON";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  skip,
  skipWhile,
} from "rxjs";
import { CommentsTotal } from "../components/dashboard/CommentsTotal";
import { ValidatesTotal } from "../components/dashboard/ValidatesTotal";
const boundChanges$ = new BehaviorSubject<google.maps.LatLngBounds | null>(
  null,
);

/**
 * Dashboard page component.
 * @returns JSX.Element
 */
export const Dashboard = () => {
  const [geojson, setGeojson] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const subscription = boundChanges$
      .pipe(
        skip(1),
        skipWhile((bounds) => bounds === null),
        distinctUntilChanged((prev, curr) => prev?.toJSON() === curr?.toJSON()),
        debounceTime(600),
      )
      .subscribe((bounds) => {
        if (!bounds) return;

        allContainersByGeoBounds(bounds).then((data: any) => {
          setGeojson(
            locationsToGeoJSON(
              data.map((container: any) => container.location),
            ),
          );
        });
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Container>
      <Row className="g-3">
        <Col lg={8} xl={9}>
          <Row className="g-3">
            <Col md={12}>
              <RevenueGraph />
            </Col>
            <Col md={12}>
              <div className="dashboard-title">Map of all containers</div>
              <div className="dashboard-map">
                <GoogleMap
                  geojson={geojson}
                  boundChanges={boundChanges$}
                  isFitBounds={false}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={4} xl={3}>
          <Row className="g-3">
            <Col md={12}>
              <EraningsTotal />
            </Col>
            <Col md={12}>
              <UsersTotal />
            </Col>
            <Col md={12}>
              <ValidatesTotal />
            </Col>
            <Col md={12}>
              <CommentsTotal />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
