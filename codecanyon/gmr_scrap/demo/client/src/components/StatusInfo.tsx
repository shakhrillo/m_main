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
    <Stack direction="horizontal" gap={1} className={color}>
      {status === "completed" ? (
        <IconCheck />
      ) : (
        <Spinner animation="border" size="sm" />
      )}
      <span className="text-uppercase">{status}</span>
    </Stack>
  );
};
