import { Icon, IconCheck, IconFrame, IconStopwatch } from "@tabler/icons-react";
import { createElement, JSX } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { IDockerContainer } from "../../types/dockerContainer";

type MachineInfoRowProps = {
  icon: Icon;
  label: string;
  value: JSX.Element | string;
};

const MachineInfoRow = ({ icon, label, value }: MachineInfoRowProps) => (
  <div className="text-secondary d-flex align-items-center">
    {createElement(icon, {
      size: 30,
    })}
    <div className="ms-3">
      <h6 className="m-0">{label}</h6>
      <small className="text-break">{value}</small>
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
          icon={IconFrame}
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
          icon={IconCheck}
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
          icon={IconStopwatch}
          label="Execution Duration"
          value={`${container?.machine?.Actor?.Attributes?.execDuration ?? 0}s`}
        />
      </Col>
    </Row>
  );
};
