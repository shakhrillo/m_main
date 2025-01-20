import {
  IconActivity,
  IconBoxMargin,
  IconClock,
  IconStopwatch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Stack,
} from "react-bootstrap";
import { dockerContainer } from "../services/dockerService";
import { IDockerContainer } from "../types/dockerContainer";
import { formatDate } from "../utils/formatDate";
import { DockerContainerAction } from "./DockerContainerAction";
import { filter } from "rxjs";
import { StatusInfo } from "./StatusInfo";
import { useNavigate } from "react-router-dom";

export const DockerContainerDetails = ({
  containerId,
}: {
  containerId: string;
}) => {
  const navigate = useNavigate();
  const [container, setContainer] = useState<any>();

  useEffect(() => {
    const subscription = dockerContainer(containerId)
      .pipe(filter((data) => JSON.stringify(data) !== "{}"))
      .subscribe((data) => {
        console.log("=");
        console.log(data);
        setContainer(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    container && (
      <Card>
        <CardHeader>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/reviews/${container.reviewId}`);
            }}
            className="fw-bold fs-5 text-decoration-none"
          >
            {container.title}
          </a>
        </CardHeader>
        <CardBody>
          <Stack>
            <Row className="row-cols-1 g-2">
              <Col>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="rounded p-2 text-secondary bg-secondary-subtle">
                    <IconActivity />
                  </div>
                  <Stack>
                    <span className="fw-bold text-muted">Action</span>
                    {/* <DockerContainerAction info={container.machine} /> */}
                    <StatusInfo info={container} />
                  </Stack>
                </Stack>
              </Col>
              <Col>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="rounded p-2 text-secondary bg-secondary-subtle">
                    <IconBoxMargin />
                  </div>
                  <Stack>
                    <span className="fw-bold text-muted">From</span>
                    <span>{container.machine.from}</span>
                  </Stack>
                </Stack>
              </Col>
              <Col>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="rounded p-2 text-secondary bg-secondary-subtle">
                    <IconStopwatch />
                  </div>
                  <Stack>
                    <span className="fw-bold text-muted">Duration</span>
                    <span>
                      {container.machine.Actor?.Attributes?.execDuration || 0} s
                    </span>
                  </Stack>
                </Stack>
              </Col>
              <Col>
                <Stack direction={"horizontal"} gap={3}>
                  <div className="rounded p-2 text-secondary bg-secondary-subtle">
                    <IconClock />
                  </div>
                  <Stack>
                    <span className="fw-bold text-muted">Time</span>
                    <span>{formatDate(container.machine.time)}</span>
                  </Stack>
                </Stack>
              </Col>
            </Row>
          </Stack>
        </CardBody>
      </Card>
    )
  );
};
