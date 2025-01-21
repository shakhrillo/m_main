import { IconCheck, IconX } from "@tabler/icons-react";
import { IDockerContainer } from "../types/dockerContainer";

export const StatusInfo = ({
  container,
  ...rest
}: {
  container?: IDockerContainer;
} & React.HTMLAttributes<HTMLDivElement>) => {
  if (!container || !container.status) return null;

  const status = container.status.toLowerCase();
  const color =
    status === "completed"
      ? "success"
      : status === "in progress"
        ? "warning"
        : "danger";

  return (
    <div {...rest}>
      <span className={`badge bg-${color} rounded-pill`}>
        {status === "completed" ? (
          <IconCheck size={18} className="me-1" />
        ) : (
          <IconX size={18} className="me-1" />
        )}
        {status}
      </span>
    </div>
  );
};
