import { Card, Row, Col, Stack } from "react-bootstrap";
import { GoogleMap } from "./GoogleMap";
import { IReview } from "../services/scrapService";
import { Ratings } from "./Ratings";
import formatNumber from "../utils/formatNumber";
import { spentTime } from "../utils/spentTime";
import { formatTimestamp } from "../utils/formatTimestamp";
import { StatusInfo } from "./StatusInfo";

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
            <hr />
            <Stack direction="horizontal" className="mb-2">
              <span className="me-auto">Status:</span>{" "}
              <StatusInfo info={info} />
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <span className="me-auto">Comments:</span>{" "}
              <strong>
                {formatNumber(info.totalReviews)} reviews /{" "}
                {formatNumber(info.totalOwnerReviews)} replies
              </strong>
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <span className="me-auto">Media:</span>
              <strong>
                {formatNumber(info.totalImages)} images /{" "}
                {formatNumber(info.totalVideos)} videos
              </strong>
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <span className="me-auto">Spent Time:</span>
              <strong>{spentTime(info)}</strong>
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <span className="me-auto">Created At:</span>
              <strong>
                {formatTimestamp(info.createdAt).date}
                {" | "}
                {formatTimestamp(info.createdAt).time}
              </strong>
            </Stack>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
