import { format } from "date-fns";

/**
 * Format a string date to a human-readable string.
 * @param timestamp The string date to format.
 * @returns The formatted timestamp.
 */
export const formatStringDate = (
  timestamp: string,
  formatStr: string = "MMM dd, yyyy HH:mm:ss a",
): string => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  return `${format(date, formatStr)}`;
};
