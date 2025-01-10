import { Timestamp } from "firebase/firestore";
import { differenceInSeconds } from "date-fns";

export const spentTime = ({
  createdAt,
  updatedAt,
}: {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}): string => {
  if (!createdAt || !updatedAt)
    throw new Error("Missing 'createdAt' or 'updatedAt'.");

  const diffInSeconds = differenceInSeconds(
    new Date(updatedAt.seconds * 1000),
    new Date(createdAt.seconds * 1000),
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
