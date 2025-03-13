import type { JSX } from "react";
import { useEffect, useState, useCallback } from "react";
import { dockerContainerBrowserLogs } from "../../services/dockerService";
import { IconChevronRight } from "@tabler/icons-react";

interface IContainerBrowserLogs {
  containerId?: string;
}

export const ContainerBrowserLogs = ({
  containerId,
}: IContainerBrowserLogs): JSX.Element => {
  const [browserLogs, setBrowserLogs] = useState<
    {
      level: string;
      message: string;
    }[]
  >([]);

  const fetchLogs = useCallback(() => {
    if (!containerId) return;

    const subscription = dockerContainerBrowserLogs(containerId).subscribe({
      next: (data = []) => {
        console.log(data);
        setBrowserLogs(data);
      },
      error: (error) => console.error("Error fetching logs:", error),
    });

    return () => subscription.unsubscribe();
  }, [containerId]);

  useEffect(fetchLogs, [fetchLogs]);

  return (
    <div className="container-logs">
      {browserLogs.map((log, index) => (
        <div
          key={index}
          className="container-log"
          style={{
            color: log?.level?.toLowerCase() === "error" ? "red" : "inherit",
          }}
        >
          <IconChevronRight size={16} />
          {log?.message}
        </div>
      ))}
    </div>
  );
};
