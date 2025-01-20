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

export const DockerContainerDetails = ({
  containerId,
}: {
  containerId: string;
}) => {
  const [info, setInfo] = useState<IDockerContainer>({} as IDockerContainer);

  useEffect(() => {
    const subscription = dockerContainer(containerId).subscribe((data) => {
      console.log(data);
      setInfo(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{info.Actor?.Attributes?.name}</CardTitle>
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
                  <DockerContainerAction info={info} />
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
                  <span>{info.from}</span>
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
                  <span>{info.Actor?.Attributes?.execDuration || 0} s</span>
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
                  <span>{formatDate(info.time)}</span>
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
};
