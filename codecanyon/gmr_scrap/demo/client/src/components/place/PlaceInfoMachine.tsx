import { IconBox, IconCheck, IconStopwatch } from "@tabler/icons-react";
import { JSX } from "react";
import { Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";

type MachineInfoRowProps = {
  icon: JSX.Element;
  label: string;
  value: string | number | undefined;
};

const MachineInfoRow = ({ icon, label, value }: MachineInfoRowProps) => (
  <div className="d-flex align-items-center">
    {icon}
    <div className="ms-3">
      <div className="fw-bold">{label}</div>
      <div>{value ?? "N/A"}</div>
    </div>
  </div>
);

export const PlaceInfoMachine = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  const machine = container?.machine || {};
  const attributes = machine?.Actor?.Attributes || {};

  return (
    <Row className="row-cols-1 g-3">
      <Col>
        <MachineInfoRow
          icon={<IconBox />}
          label="Machine ID"
          value={attributes.name}
        />
      </Col>
      <Col>
        <MachineInfoRow
          icon={<IconCheck />}
          label="Machine Status"
          value={machine?.status}
        />
      </Col>
      <Col>
        <MachineInfoRow
          icon={<IconStopwatch />}
          label="Execution Duration"
          value={`${attributes.execDuration ?? 0}s`}
        />
      </Col>
    </Row>
  );
};
