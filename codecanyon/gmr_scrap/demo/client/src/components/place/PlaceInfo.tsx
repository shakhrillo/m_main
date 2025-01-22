import { Accordion, Card, Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";
import { useState, useEffect } from "react";
import { map, filter, take } from "rxjs";
import { dockerContainers } from "../../services/dockerService";
import { GeoPoint } from "firebase/firestore";

import { useMemo } from "react";

export const PlaceInfo = ({
  containerId,
  ...rest
}: {
  containerId: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );
  const [location, setLocation] = useState<GeoPoint | undefined>(undefined);

  useEffect(() => {
    if (!containerId) {
      setContainer({} as IDockerContainer);
      return;
    }

    const subscription = dockerContainers({ containerId })
      .pipe(
        map((data) => (Array.isArray(data) ? data[0] : null)),
        filter((data) => !!data),
      )
      .subscribe((data) => {
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  useEffect(() => {
    if (!container?.location) {
      return;
    }
    setLocation(container?.location);
  }, [container?.location?.latitude, container?.location?.longitude]);

  // Memoize locations to prevent unnecessary updates
  const memoizedLocations = useMemo(
    () => (location ? [location] : undefined),
    [location],
  );

  console.log("-reload--");

  return (
    <Card {...rest}>
      <Row className="g-0 row-cols-1">
        <Col>
          <div
            style={{ height: "300px" }}
            className="rounded-top overflow-hidden"
          >
            <GoogleMap locations={memoizedLocations} />
          </div>
        </Col>
        <Col>
          <Card.Body>
            <Card.Title className="text-primary">
              {container.title || "N/A"}
            </Card.Title>
            {container.rating && <Ratings container={container} />}
            <Accordion defaultActiveKey="0" flush className="mt-3 mx-n3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Machine</Accordion.Header>
                <Accordion.Body>
                  <PlaceInfoMachine container={container} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Options</Accordion.Header>
                <Accordion.Body>
                  <PlaceInfoOptions container={container} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
