import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { spentTime } from "../utils/spentTime";
import { GoogleMap } from "./GoogleMap";
import { Ratings } from "./Ratings";
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
            <div className="my-3">
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Status:</span>{" "}
                <StatusInfo info={info} />
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Limit:</span>
                <strong>{info.limit} comments</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Sort:</span>
                <strong>{info.sortBy}</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Extract Image Urls:</span>
                <strong>{info.extractImageUrls ? "Yes" : "No"}</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Extract Video Urls:</span>
                <strong>{info.extractVideoUrls ? "Yes" : "No"}</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Extract Owner Replies:</span>
                <strong>{info.extractOwnerResponse ? "Yes" : "No"}</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Coordinates:</span>{" "}
                <strong>
                  {info.location?.latitude}, {info.location?.longitude}
                </strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Comments:</span>{" "}
                <strong>
                  {formatNumber(info.totalReviews)} reviews /{" "}
                  {formatNumber(info.totalOwnerReviews)} replies
                </strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Media:</span>
                <strong>
                  {formatNumber(info.totalImages)} images /{" "}
                  {formatNumber(info.totalVideos)} videos
                </strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Spent Time:</span>
                <strong>{spentTime(info)}</strong>
              </Stack>
              <Stack direction="horizontal" className="py-1">
                <span className="me-auto">Created At:</span>
                <strong>
                  {formatTimestamp(info.createdAt).date}{" "}
                  {formatTimestamp(info.createdAt).time}
                </strong>
              </Stack>
            </div>
            <Stack gap={3} direction="horizontal">
              <Button variant="secondary" className="w-100">
                Download CSV
              </Button>
              <Button variant="outline-secondary" className="w-100">
                Download JSON
              </Button>
            </Stack>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
