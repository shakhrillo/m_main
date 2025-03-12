import type { JSX } from "react";
import { Stack, Badge } from "react-bootstrap";
import { IconPrompt } from "@tabler/icons-react";
import type { IDockerContainer } from "../../types/dockerContainer";

interface IContainerInfo {
  container: IDockerContainer;
}

/**
 * ContainerInfo component
 * @param {IDockerContainer} container - Container object
 * @returns {JSX.Element} ContainerInfo
 */
export const ContainerInfo = ({ container }: IContainerInfo): JSX.Element => {
  return (
    <Stack direction="horizontal" gap={2}>
      <IconPrompt />
      <div className="text-capitalize">{container.type}</div>
      <Badge
        bg={
          container.machine?.Action === "die" ||
          container.machine?.Action === "destroy"
            ? "danger"
            : container.machine?.Action === "start"
              ? "success"
              : "secondary"
        }
        className="text-capitalize"
      >
        {container.machine?.Action}
      </Badge>
    </Stack>
  );
};
