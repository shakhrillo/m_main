import { Timestamp } from "firebase/firestore";

export const spentTime = (placeInfo: {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}): string => {
  const createdAt: Timestamp = placeInfo.createdAt;
  const updatedAt: Timestamp = placeInfo.updatedAt;

  // Ensure both timestamps are defined
  if (!createdAt || !updatedAt) {
    throw new Error("Missing 'createdAt' or 'updatedAt' in placeInfo.");
  }

  // Calculate difference in seconds, considering both seconds and nanoseconds
  const createdAtSeconds = createdAt.seconds + createdAt.nanoseconds / 1e9;
  const updatedAtSeconds = updatedAt.seconds + updatedAt.nanoseconds / 1e9;

  const diff = updatedAtSeconds - createdAtSeconds;

  // Prevent negative time difference
  if (diff < 0) {
    throw new Error("'updatedAt' must be later than 'createdAt'.");
  }

  // Convert difference to hours, minutes, and seconds
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  // Format as HH:MM:SS with zero padding
  const formattedTime = [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");

  return formattedTime;
};
