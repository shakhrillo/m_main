import type { IDockerContainer } from "../types/dockerContainer";

/**
 * DockerContainerAction component
 * @param info
 * @returns 'Started' badge if the action is 'start', 'Deleted' badge if the action is 'destroy', and 'Action' badge if the action is anything else
 */
export const DockerContainerAction = ({ info }: { info: IDockerContainer }) => {
  return (
    info.Action && (
      <div className="d-flex">
        <span
          className={
            `badge ` +
            (info.Action === "start"
              ? "bg-success"
              : info.Action === "destroy"
                ? "bg-danger"
                : "bg-primary")
          }
        >
          {info.Action === "start"
            ? "Started"
            : info.Action === "destroy"
              ? "Deleted"
              : info.Action}
        </span>
      </div>
    )
  );
};
