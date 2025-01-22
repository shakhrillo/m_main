import { Accordion, Card, Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { GoogleMap } from "../GoogleMap";
import { Ratings } from "../Ratings";
import { PlaceInfoMachine } from "./PlaceInfoMachine";
import { PlaceInfoOptions } from "./PlaceInfoOptions";

export const PlaceInfo = ({
  containerId,
  container,
  ...rest
}: {
  containerId: string;
  container: IDockerContainer;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Card {...rest}>
      <Row className="g-0 row-cols-1">
        <Col>
          <div
            style={{ height: "300px" }}
            className="rounded-top overflow-hidden"
          >
            <GoogleMap locations={container.location && [container.location]} />
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
