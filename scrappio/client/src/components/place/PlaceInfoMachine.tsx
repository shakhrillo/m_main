import type { Icon } from "@tabler/icons-react";
import {
  IconBrowser,
  IconCheck,
  IconFrame,
  IconStopwatch,
} from "@tabler/icons-react";
import type { JSX } from "react";
import { createElement } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { NavLink, useOutletContext } from "react-router-dom";
import type { IDockerContainer } from "../../types/dockerContainer";
import type { IUserInfo } from "../../types/userInfo";
import { spentTime } from "../../utils";

interface IPlaceInfoMachine {
  container: IDockerContainer;
}

type MachineInfoRowProps = {
  icon: Icon;
  label: string;
  value: JSX.Element | string;
};

/**
 * MachineInfoRow component
 * @param {MachineInfoRowProps} props
 * @param {Icon} props.icon
 * @param {string} props.label
 * @param {JSX.Element | string} props.value
 * @returns {JSX.Element}
 */
const MachineInfoRow = ({
  icon,
  label,
  value,
}: MachineInfoRowProps): JSX.Element => (
  <div className="place-info-details">
    <div className="d-block">{createElement(icon)}</div>
    <div className="place-info-content">
      <div className="place-info-label">{label}</div>
      <div className="place-info-value">{value || "N/A"}</div>
    </div>
  </div>
);

/**
 * PlaceInfoMachine component
 * @param {IPlaceInfoMachine} props
 * @param {IDockerContainer} props.container
 * @returns {JSX.Element}
 */
export const PlaceInfoMachine = ({
  container,
}: IPlaceInfoMachine): JSX.Element => {
  const user = useOutletContext<IUserInfo>();

  return (
    <Row className="row-cols-1">
      <Col>
        <MachineInfoRow
          icon={IconFrame}
          label="Machine ID"
          value={
            user?.isAdmin && container?.id ? (
              <NavLink to={`/containers/${container?.id}`}>
                {container?.id ?? "N/A"}
              </NavLink>
            ) : (
              (container?.id ?? "N/A")
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
              bg={
                container?.machine?.status === "destroy" ||
                container?.machine?.status === "die"
                  ? "danger"
                  : "info"
              }
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
          value={`${container?.machine?.Actor?.Attributes?.execDuration || spentTime(container)}s`}
        />
      </Col>

      <Col>
        <MachineInfoRow
          icon={IconBrowser}
          label="Browser"
          value={`${container?.browser?.browserName || "N/A"} ${
            container?.browser?.browserVersion
              ? `(${container?.browser?.browserVersion})`
              : ""
          }`}
        />
      </Col>
    </Row>
  );
};
