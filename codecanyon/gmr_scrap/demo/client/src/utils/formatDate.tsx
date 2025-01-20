import { format } from "date-fns";

/**
 * Format a Unix timestamp to a human-readable string.
 * @param timestamp The Unix timestamp to format.
 * @returns The formatted timestamp.
 */
export const formatDate = (timestamp: number): string => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp * 1000);
  return `${format(date, "MMM dd, yyyy")} ${format(date, "HH:mm:ss a")}`;
};
