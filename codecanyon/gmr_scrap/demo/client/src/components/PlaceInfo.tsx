import { Card, Row, Col } from "react-bootstrap";
import { GoogleMap } from "./GoogleMap";
import { IReview } from "../services/scrapService";
import { Ratings } from "./Ratings";

export const PlaceInfo = ({ info }: { info: IReview | undefined }) => {
  return info ? (
    <Card>
      <Row className="g-0 row-cols-1">
        <Col>
          {info?.location ? (
            <div
              style={{ height: "300px" }}
              className="rounded-top overflow-hidden"
            >
              <GoogleMap location={info?.location} />
            </div>
          ) : null}
        </Col>
        <Col>
          <Card.Body>
            <Card.Title className="text-primary">{info.title}</Card.Title>
            <Ratings info={info} />
            {/* <Card.Link href={info.url} target="_blank" rel="noreferrer">
              {info.address}
            </Card.Link> */}
            <ul className="d-none list-unstyled">
              <li>
                <strong>Status:</strong> {info.status}
              </li>
              <li>
                <strong>Average Rating:</strong>{" "}
                {info.rating ? info.rating : "N/A"}
              </li>
              <li>
                {/* <strong>Extracted Reviews:</strong> {info.totalReviews || 0} */}
              </li>
              <li>
                <strong>Spent Time:</strong>
              </li>
            </ul>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
