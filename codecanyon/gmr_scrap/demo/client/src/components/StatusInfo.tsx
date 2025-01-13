import { IconCheck, IconX } from "@tabler/icons-react";
import { IReview } from "../services/scrapService";

export const StatusInfo = ({ info }: { info: IReview | undefined }) => {
  if (!info || !info.status) return null;

  const status = info.status.toLowerCase();
  const color =
    status === "completed"
      ? "success"
      : status === "in progress"
        ? "warning"
        : "danger";

  return (
    <span className={`badge bg-${color} rounded-pill`}>
      {status === "completed" ? (
        <IconCheck size={18} className="me-1" />
      ) : (
        <IconX size={18} className="me-1" />
      )}
      {status}
    </span>
  );
};
