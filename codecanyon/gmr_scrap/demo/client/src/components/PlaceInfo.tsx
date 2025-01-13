import { Card, Row, Col, Stack } from "react-bootstrap";
import { GoogleMap } from "./GoogleMap";
import { IReview } from "../services/scrapService";
import { Ratings } from "./Ratings";
import formatNumber from "../utils/formatNumber";
import { spentTime } from "../utils/spentTime";
import { formatTimestamp } from "../utils/formatTimestamp";

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
              <strong className="me-auto">Status:</strong> {info.status}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Reviews:</strong>{" "}
              {formatNumber(info.totalReviews)}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Images:</strong>{" "}
              {formatNumber(info.totalImages)}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Videos:</strong>{" "}
              {formatNumber(info.totalVideos)}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Owner Reviews:</strong>{" "}
              {formatNumber(info.totalOwnerReviews)}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Spent Time:</strong> {spentTime(info)}
            </Stack>
            <Stack direction="horizontal" className="mb-2">
              <strong className="me-auto">Created At:</strong>{" "}
              {formatTimestamp(info.createdAt).date}{" "}
              {formatTimestamp(info.createdAt).time}
            </Stack>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
