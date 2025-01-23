import {
  IconBox,
  IconCheck,
  IconFrame,
  IconStopwatch,
} from "@tabler/icons-react";
import { JSX } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { NavLink, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  return (
    <Row className="row-cols-1 g-3">
      <Col>
        <MachineInfoRow
          icon={<IconFrame />}
          label="Machine ID"
          value={
            <NavLink to={`/containers/${container?.machineId}`}>
              {container?.machine?.Actor?.Attributes?.name}
            </NavLink>
          }
        />
      </Col>
      <Col>
        <MachineInfoRow
          icon={<IconCheck />}
          label="Machine Status"
          value={
            <Badge
              className="text-capitalize"
              pill
              bg={container?.machine?.status === "die" ? "danger" : "info"}
            >
              {container?.machine?.status}
            </Badge>
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
