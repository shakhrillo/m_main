import { IconCheck, IconX } from "@tabler/icons-react";
import { IReview } from "../services/scrapService";

export const StatusInfo = ({
  info,
  ...rest
}: {
  info?: IReview;
} & React.HTMLAttributes<HTMLDivElement>) => {
  if (!info || !info.status) return null;

  const status = info.status.toLowerCase();
  const color =
    status === "completed"
      ? "success"
      : status === "in progress"
        ? "warning"
        : "danger";

  return (
    <div {...rest} className="my-2">
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
