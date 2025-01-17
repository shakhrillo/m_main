import { Alert, Card, Col, Row, Stack } from "react-bootstrap";
import { IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { spentTime } from "../utils/spentTime";
import { GoogleMap } from "./GoogleMap";
import { Ratings } from "./Ratings";
import { StatusInfo } from "./StatusInfo";
import emptyFolder from "../assets/emptyFolder.png";
import {
  IconAlertSquareRoundedFilled,
  IconInfoCircle,
} from "@tabler/icons-react";

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
              <GoogleMap locations={[info.location]} />
            </div>
          ) : null}
        </Col>
        <Col>
          <Card.Body>
            <Card.Title className="mt-3 text-primary">{info.title}</Card.Title>
            <Ratings info={info} />
            <StatusInfo info={info} />
            {info.type === "comments" && (
              <>
                <h5 className="mt-3">Options</h5>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  <small className="me-auto">Limit:</small>
                  <small>
                    <b>{info.limit} comments</b>
                  </small>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  <small className="me-auto">Sort:</small>
                  <small>
                    <b>{info.sortBy}</b>
                  </small>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  <small className="me-auto">Extract Image Urls:</small>
                  <small>
                    <b>{info.extractImageUrls ? "Yes" : "No"}</b>
                  </small>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  <small className="me-auto">Extract Video Urls:</small>
                  <small>
                    <b>{info.extractVideoUrls ? "Yes" : "No"}</b>
                  </small>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  <small className="me-auto">Extract Owner Replies:</small>
                  <small>
                    <b>{info.extractOwnerResponse ? "Yes" : "No"}</b>
                  </small>
                </Stack>
              </>
            )}
            {info.location && (
              <Stack gap={2}>
                <h5 className="place-info-title mt-3">Details:</h5>
                <Stack direction="horizontal" className="place-info-item">
                  <small>Latitude:</small>
                  <b>{info.location?.latitude}</b>
                </Stack>
                <Stack direction="horizontal" className="place-info-item">
                  <small className="me-auto">Longitude:</small>{" "}
                  <small>
                    <b>{info.location?.longitude}</b>
                  </small>
                </Stack>
                {info.type === "comments" && (
                  <>
                    <Stack
                      direction="horizontal"
                      className="justify-content-between"
                    >
                      <small>Comments:</small>
                      <small>
                        <b>
                          {formatNumber(info.totalReviews)} reviews /{" "}
                          {formatNumber(info.totalOwnerReviews)} replies
                        </b>
                      </small>
                    </Stack>
                    <Stack
                      direction="horizontal"
                      className="justify-content-between"
                    >
                      <small className="me-auto">Media:</small>
                      <small>
                        <b>
                          {formatNumber(info.totalImages)} images /{" "}
                          {formatNumber(info.totalVideos)} videos
                        </b>
                      </small>
                    </Stack>
                  </>
                )}
                <Stack direction="horizontal" className="place-info-item">
                  <small>Spent Time:</small>
                  <small>
                    <b>{spentTime(info)}</b>
                  </small>
                </Stack>
                <Stack direction="horizontal" className="place-info-item">
                  <small>Created At:</small>
                  <small>
                    <b>{formatTimestamp(info.createdAt)}</b>
                  </small>
                </Stack>
              </Stack>
            )}
            {!info.status && (
              <Stack>
                <Alert variant="info" className="d-flex">
                  <div className="me-2">
                    <IconInfoCircle></IconInfoCircle>
                  </div>
                  Please scrape something to display more information.
                </Alert>
              </Stack>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  ) : null;
};
