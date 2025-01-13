import { Timestamp } from "firebase/firestore";
import { differenceInSeconds } from "date-fns";
import { IReview } from "../services/scrapService";

export const spentTime = (info: IReview) => {
  if (!info.createdAt || !info.updatedAt) return "00:00:00";

  const diffInSeconds = differenceInSeconds(
    new Date(info.updatedAt.seconds * 1000),
    new Date(info.createdAt.seconds * 1000),
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
