import { useEffect, useState } from "react";
import { dockerContainerLogs } from "../../services/dockerService";
import { IconArrowRight, IconChevronRight } from "@tabler/icons-react";

interface IContainerLogs {
  containerId: string | undefined;
}

export const ContainerLogs = ({ containerId }: IContainerLogs) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!containerId) {
      return;
    }

    const subscription = dockerContainerLogs(containerId).subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          return;
        }

        setLogs(data.map(({ logs }: { logs: string }) => logs));
      },
      error: (error) => console.error("Error fetching logs data:", error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [containerId]);

  return (
    <div className="container-logs">
      {logs.map((log, index) => (
        <div className="container-log" key={index}>
          <IconChevronRight size={16} />
          {log.trim().replace(/\n/g, "")}
        </div>
      ))}
    </div>
  );
};