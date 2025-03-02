import { useEffect, useState, useCallback, JSX } from "react";
import { dockerContainerLogs } from "../../services/dockerService";
import { IconChevronRight } from "@tabler/icons-react";

interface IContainerLogs {
  containerId?: string;
}

/**
 * ContainerLogs component
 * @param {string} containerId - Container ID
 * @returns {JSX.Element} - ContainerLogs component
 */
export const ContainerLogs = ({ containerId }: IContainerLogs): JSX.Element => {
  const [logs, setLogs] = useState<string[]>([]);

  const fetchLogs = useCallback(() => {
    if (!containerId) return;

    const subscription = dockerContainerLogs(containerId).subscribe({
      next: (data = []) => {
        setLogs((prevLogs) => [
          ...prevLogs,
          ...data.flatMap(({ logs }: { logs: string }) => logs.trim()),
        ]);
      },
      error: (error) => console.error("Error fetching logs:", error),
    });

    return () => subscription.unsubscribe();
  }, [containerId]);

  useEffect(fetchLogs, [fetchLogs]);

  return (
    <div className="container-logs">
      {logs.map((log, index) => (
        <div className="container-log" key={index}>
          <IconChevronRight size={16} />
          {log}
        </div>
      ))}
    </div>
  );
};
