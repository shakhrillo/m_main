import {
  IconBox,
  IconCheck,
  IconFrame,
  IconStopwatch,
} from "@tabler/icons-react";
import { JSX } from "react";
import { Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";

type MachineInfoRowProps = {
  icon: JSX.Element;
  label: string;
  value: JSX.Element | string;
};

const MachineInfoRow = ({ icon, label, value }: MachineInfoRowProps) => (
  <div className="d-flex align-items-center">
    {icon}
    <div className="ms-3">
      <div className="text-break fw-bold">{label}</div>
      <div className="text-break">{value}</div>
    </div>
  </div>
);

export const PlaceInfoMachine = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  return (
    <Row className="row-cols-1 g-3">
      <Col>
        <MachineInfoRow
          icon={<IconFrame />}
          label="Machine ID"
          value={container?.machine?.Actor?.Attributes?.name || "N/A"}
        />
      </Col>
      <Col>
        <MachineInfoRow
          icon={<IconCheck />}
          label="Machine Status"
          value={
            <span className="text-capitalize">
              {container?.machine?.status || "unknown"}
            </span>
          }
        />
      </Col>
      <Col>
        <MachineInfoRow
          icon={<IconStopwatch />}
          label="Execution Duration"
          value={`${container?.machine?.Actor?.Attributes?.execDuration ?? 0}s`}
        />
      </Col>
    </Row>
  );
};
