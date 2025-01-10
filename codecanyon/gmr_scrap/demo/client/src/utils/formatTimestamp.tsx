import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export const formatTimestamp = (
  timestamp: Timestamp | null,
): { date: string; time: string } => {
  if (!timestamp) return { date: "", time: "" };

  const date = timestamp.toDate();

  return {
    date: format(date, "yyyy/MM/dd"),
    time: format(date, "HH:mm:ss"),
  };
};
