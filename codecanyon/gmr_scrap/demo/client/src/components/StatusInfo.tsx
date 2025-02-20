import { IconCheck } from "@tabler/icons-react";
import { Spinner, Stack } from "react-bootstrap";
import { IDockerContainer } from "../types/dockerContainer";

export const StatusInfo = ({ container }: { container?: IDockerContainer }) => {
  if (!container || !container.status) return null;

  const status = container.status.toLowerCase();
  const color =
    status === "completed"
      ? "text-success"
      : status === "in progress"
        ? "text-warning"
        : "text-danger";

  return (
    <Stack direction="horizontal" gap={2} className={color}>
      {status === "completed" ? (
        <IconCheck size={18} />
      ) : (
        <Spinner animation="border" size="sm" />
      )}
      <span className="text-capitalize">{status}</span>
    </Stack>
  );
};
