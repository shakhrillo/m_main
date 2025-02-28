import type { Icon} from "@tabler/icons-react";
import { IconCheck, IconFrame, IconStopwatch } from "@tabler/icons-react";
import type { JSX } from "react";
import { createElement } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import type { IDockerContainer } from "../../types/dockerContainer";
import type { IUserInfo } from "../../types/userInfo";

type MachineInfoRowProps = {
  icon: Icon;
  label: string;
  value: JSX.Element | string;
};

const MachineInfoRow = ({ icon, label, value }: MachineInfoRowProps) => (
  <div className="place-info-details">
    {createElement(icon)}
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value || "N/A"}</div>
    </div>
  </div>
);

export const PlaceInfoMachine = ({
  container,
}: {
  container: IDockerContainer;
}) => {
  const user = useOutletContext<IUserInfo>();

  return (
    <Row className="row-cols-1">
      <Col>
        <MachineInfoRow
          icon={IconFrame}
          label="Machine ID"
          value={
            user?.isAdmin && container?.machineId ? (
              <NavLink to={`/containers/${container?.machineId}`}>
                {container?.machine?.Actor?.Attributes?.name ?? "N/A"}
              </NavLink>
            ) : (
              (container?.machine?.Actor?.Attributes?.name ?? "N/A")
            )
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
