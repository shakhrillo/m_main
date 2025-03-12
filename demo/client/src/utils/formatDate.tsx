import { format } from "date-fns";

/**
 * Format a Unix timestamp to a human-readable string.
 * @param timestamp The Unix timestamp to format.
 * @returns The formatted timestamp.
 */
export const formatDate = (
  timestamp: number | undefined,
  isFull?: boolean,
): string => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp * 1000);

  if (isFull) {
    return format(date, "MMM dd, yyyy HH:mm:ss a");
  }

  return format(date, "MMM dd, yyyy");
};
