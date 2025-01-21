import { IconInfoCircle } from "@tabler/icons-react";
import { Alert, Card, Col, Row, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { dockerContainers } from "../services/dockerService";
import { filter, map } from "rxjs";
import { IDockerContainer } from "../types/dockerContainer";
import { GoogleMap } from "./GoogleMap";
import { Ratings } from "./Ratings";
import { StatusInfo } from "./StatusInfo";
import formatNumber from "../utils/formatNumber";
import { formatTimestamp } from "../utils/formatTimestamp";
import { spentTime } from "../utils/spentTime";
import { formatDate } from "../utils/formatDate";

const MachineInfo = ({ machine }: { machine: any }) => (
  <>
    <h5>Machine</h5>
    <Stack direction="horizontal" className="justify-content-between">
      Status: <span className="badge bg-info">{machine?.Action}</span>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Execution Duration:{" "}
      <span className="fw-bold">
        {machine?.Actor?.Attributes?.execDuration}s
      </span>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Image:{" "}
      <span className="fw-bold">{machine?.Actor?.Attributes?.image}</span>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Time: <span className="fw-bold">{formatDate(machine?.time)}</span>
    </Stack>
  </>
);

const OptionsInfo = ({ container }: { container: IDockerContainer }) => (
  <>
    <h5 className="mt-3">Options</h5>
    <Stack direction="horizontal" className="justify-content-between">
      Limit: <b>{container.limit} comments</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Sort: <b>{container.sortBy}</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Extract Image Urls: <b>{container.extractImageUrls ? "Yes" : "No"}</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Extract Video Urls: <b>{container.extractVideoUrls ? "Yes" : "No"}</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Extract Owner Replies:{" "}
      <b>{container.extractOwnerResponse ? "Yes" : "No"}</b>
    </Stack>
  </>
);

const LocationDetails = ({ container }: { container: IDockerContainer }) => (
  <Stack gap={2}>
    <h5 className="mt-3">Details:</h5>
    <Stack direction="horizontal" className="justify-content-between">
      Latitude: <b>{container.location?.latitude}</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Longitude: <b>{container.location?.longitude}</b>
    </Stack>
    {container.type === "comments" && (
      <>
        <Stack direction="horizontal" className="justify-content-between">
          Comments:
          <b>
            {formatNumber(container.totalReviews)} reviews /{" "}
            {formatNumber(container.totalOwnerReviews)} replies
          </b>
        </Stack>
        <Stack direction="horizontal" className="justify-content-between">
          Media:
          <b>
            {formatNumber(container.totalImages)} images /{" "}
            {formatNumber(container.totalVideos)} videos
          </b>
        </Stack>
      </>
    )}
    <Stack direction="horizontal" className="justify-content-between">
      Spent Time: <b>{spentTime(container)}</b>
    </Stack>
    <Stack direction="horizontal" className="justify-content-between">
      Created At: <b>{formatTimestamp(container.createdAt)}</b>
    </Stack>
  </Stack>
);

export const PlaceInfo = ({
  reviewId,
  ...rest
}: {
  reviewId: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [container, setContainer] = useState<IDockerContainer>(
    {} as IDockerContainer,
  );

  useEffect(() => {
    if (!reviewId) return;

    const subscription = dockerContainers({ reviewId })
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
  }, [reviewId]);

  return (
    <Card {...rest}>
      <Row className="g-0 row-cols-1">
        <Col>
          {container?.location && (
            <div
              style={{ height: "300px" }}
              className="rounded-top overflow-hidden"
            >
              <GoogleMap locations={[container.location]} />
            </div>
          )}
        </Col>
        <Col>
          <Card.Body>
            <Card.Title className="text-primary">{container.title}</Card.Title>
            <Ratings info={container} />
            <StatusInfo info={container} className="my-2" />
            <hr />
            {container.machine && <MachineInfo machine={container.machine} />}
            <hr />
            {container.type === "comments" && (
              <OptionsInfo container={container} />
            )}
            <hr />
            {container.location && <LocationDetails container={container} />}
            {!container.status && (
              <Stack>
                <Alert variant="info" className="d-flex">
                  <div className="me-2">
                    <IconInfoCircle />
                  </div>
                  Please scrape something to display more information.
                </Alert>
              </Stack>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
