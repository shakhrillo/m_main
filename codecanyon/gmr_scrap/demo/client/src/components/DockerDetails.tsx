import {
  IconBrandDocker,
  IconDeviceDesktop,
  IconDeviceSdCard,
  IconNetwork,
  IconServer,
  IconTerminal,
  IconVersions,
} from "@tabler/icons-react";
import {
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Col,
  Row,
  Stack,
} from "react-bootstrap";
import { formatSize } from "../utils/formatSize";
import { DockerConfig } from "../types/dockerConfig";

export const DockerDetails = ({ info }: { info: DockerConfig }) => {
  return (
    <Card>
      <CardHeader className="d-flex align-items-center gap-3">
        <IconBrandDocker size={48} className="text-primary" />
        <Stack>
          <CardTitle className="text-capitalize text-primary">Docker</CardTitle>
          <CardSubtitle>{info.ServerVersion}</CardSubtitle>
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack>
          <Row className="row-cols-1 g-2">
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconDeviceSdCard />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Total Memory</strong>
                  <span>{formatSize(info.MemTotal || 0)}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconServer />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Architecture</strong>
                  <span>{info.Architecture}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconTerminal />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">OS</strong>
                  <span>{info.OSType}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconDeviceDesktop />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">Kernel Version</strong>
                  <span>{info.KernelVersion}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconVersions />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">OSVersion</strong>
                  <span>{info.OSVersion}</span>
                </Stack>
              </Stack>
            </Col>
            <Col>
              <Stack direction={"horizontal"} gap={3}>
                <div className="rounded p-2 text-secondary bg-secondary-subtle">
                  <IconNetwork />
                </div>
                <Stack direction={"vertical"}>
                  <strong className="text-muted">NCPU</strong>
                  <span>{info.NCPU}</span>
                </Stack>
              </Stack>
            </Col>
          </Row>
        </Stack>
      </CardBody>
    </Card>
  );
};
