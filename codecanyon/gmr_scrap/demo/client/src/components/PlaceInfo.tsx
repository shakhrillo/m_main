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
            <Card.Title className="text-primary">{info.title}</Card.Title>
            <Ratings info={info} />
            <StatusInfo info={info} className="my-2" />
            {info.type === "comments" && (
              <>
                <h5 className="mt-3">Options</h5>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Limit:
                  <b>{info.limit} comments</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Sort:
                  <b>{info.sortBy}</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Extract Image Urls:
                  <b>{info.extractImageUrls ? "Yes" : "No"}</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Extract Video Urls:
                  <b>{info.extractVideoUrls ? "Yes" : "No"}</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Extract Owner Replies:
                  <b>{info.extractOwnerResponse ? "Yes" : "No"}</b>
                </Stack>
              </>
            )}
            {info.location && (
              <Stack gap={2}>
                <h5 className="mt-3">Details:</h5>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Latitude:
                  <b>{info.location?.latitude}</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Longitude:
                  <b>{info.location?.longitude}</b>
                </Stack>
                {info.type === "comments" && (
                  <>
                    <Stack
                      direction="horizontal"
                      className="justify-content-between"
                    >
                      Comments:
                      <b>
                        {formatNumber(info.totalReviews)} reviews /{" "}
                        {formatNumber(info.totalOwnerReviews)} replies
                      </b>
                    </Stack>
                    <Stack
                      direction="horizontal"
                      className="justify-content-between"
                    >
                      Media
                      <b>
                        {formatNumber(info.totalImages)} images /{" "}
                        {formatNumber(info.totalVideos)} videos
                      </b>
                    </Stack>
                  </>
                )}
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Spent Time:
                  <b>{spentTime(info)}</b>
                </Stack>
                <Stack
                  direction="horizontal"
                  className="justify-content-between"
                >
                  Created At:
                  <b>{formatTimestamp(info.createdAt)}</b>
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
