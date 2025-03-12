import type { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

/**
 * Format a Firestore timestamp to a human-readable string.
 * @param timestamp The Firestore timestamp to format.
 * @returns The formatted timestamp.
 */
export const formatTimestamp = (
  timestamp: Timestamp | null | undefined,
): string => {
  if (!timestamp) return "";

  const date = timestamp.toDate();

  return `${format(date, "MMM dd, yyyy")} ${format(date, "HH:mm:ss a")}`;
};
