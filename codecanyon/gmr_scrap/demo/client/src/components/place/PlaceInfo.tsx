import { useEffect, useState } from "react";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { filter, map } from "rxjs";
import { dockerContainers } from "../../services/dockerService";
import { IDockerContainer } from "../../types/dockerContainer";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";

export const PlaceInfo = ({
  containerId,
  ...rest
}: {
  containerId: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

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

  return (
    <Card {...rest}>
      <Row className="g-0 row-cols-1">
        {containerId && (
          <Col>
            <div
              style={{ height: "300px" }}
              className="rounded-top overflow-hidden"
            >
              <GoogleMap
                geojson={{
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      geometry: {
                        type: "Point",
                        coordinates: [
                          container.location?.longitude || 0,
                          container.location?.latitude || 0,
                        ],
                      },
                      properties: {},
                    },
                  ],
                }}
              />
            </div>
          </Col>
        )}
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
