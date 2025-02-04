import { Badge } from "react-bootstrap";
import { IDockerContainer } from "../types/dockerContainer";

export const StatusInfo = ({ container }: { container?: IDockerContainer }) => {
  if (!container || !container.status) return null;

  const status = container.status.toLowerCase();
  const color =
    status === "completed"
      ? "success"
      : status === "in progress"
        ? "warning"
        : "danger";

  return (
    <Badge bg={color} pill className="text-capitalize">
      {status}
    </Badge>
  );
};
