import { Card, Col, Row, Stack } from "react-bootstrap";
import { IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { spentTime } from "../utils/spentTime";
import { GoogleMap } from "./GoogleMap";
import { Ratings } from "./Ratings";
import { StatusInfo } from "./StatusInfo";

export const PlaceInfo = ({
  info,
  ...rest
}: {
  info?: IReview;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return info ? (
    <Card {...rest}>
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
            <StatusInfo info={info} />
            <Card.Title className="mt-3 text-primary">{info.title}</Card.Title>
            <Ratings info={info} />
            {info.type === "comments" && (
              <>
                <h5 className="mt-3">Options</h5>
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
              </>
            )}
            <h5 className="mt-3">Details </h5>
            <Stack direction="horizontal" className="py-1">
              <span className="me-auto">Coordinates:</span>{" "}
              <strong>
                {info.location?.latitude}, {info.location?.longitude}
              </strong>
            </Stack>
            {info.type === "comments" && (
              <>
                <Stack direction="horizontal" className="py-1">
                  <span className="me-auto">Comments:</span>{" "}
                  <small>
                    {formatNumber(info.totalReviews)} reviews /{" "}
                    {formatNumber(info.totalOwnerReviews)} replies
                  </small>
                </Stack>
                <Stack direction="horizontal" className="py-1">
                  <span className="me-auto">Media:</span>
                  <strong>
                    {formatNumber(info.totalImages)} images /{" "}
                    {formatNumber(info.totalVideos)} videos
                  </strong>
                </Stack>
              </>
            )}
            <Stack direction="horizontal" className="py-1">
              <span className="me-auto">Spent Time:</span>
              <strong>{spentTime(info)}</strong>
            </Stack>
            <Stack direction="horizontal" className="py-1">
              <span className="me-auto">Created At:</span>
              <strong>{formatTimestamp(info.createdAt)}</strong>
            </Stack>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
