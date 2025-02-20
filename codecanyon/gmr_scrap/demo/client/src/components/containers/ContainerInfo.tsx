import { Stack, Badge } from "react-bootstrap";
import { IDockerContainer } from "../../types/dockerContainer";
import { IconSlash } from "@tabler/icons-react";

interface IContainerInfo {
  container: IDockerContainer;
}

export const ContainerInfo = ({ container }: IContainerInfo) => {
  return (
    <>
      <Stack direction="horizontal" gap={2}>
        <IconSlash size={18} />
        <div className="text-capitalize">
          {container.type}
        </div>
        <Badge
          bg={
            container.machine?.Action === "die" ? "danger" : container.machine?.Action === "start" ? "success" : "secondary"
          }
          className="text-capitalize"
        >
          {container.machine?.Action}
        </Badge>
      </Stack>
    </>
  )
};