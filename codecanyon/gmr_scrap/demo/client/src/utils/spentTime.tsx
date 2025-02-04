import { differenceInSeconds } from "date-fns";
import { IDockerContainer } from "../types/dockerContainer";

export const spentTime = (container: IDockerContainer) => {
  if (!container.createdAt || !container.updatedAt) return "00:00:00";

  const diffInSeconds = differenceInSeconds(
    new Date(container.updatedAt.seconds * 1000),
    new Date(container.createdAt.seconds * 1000),
  );

  if (diffInSeconds < 0)
    throw new Error("'updatedAt' must be later than 'createdAt'.");

  const hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(diffInSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
