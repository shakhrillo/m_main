import { Timestamp } from "firebase/firestore" // Adjust import based on your setup

export const spentTime = (start: Timestamp, end: Timestamp): string => {
  if (!start || !end) return ""
  const diff = end.seconds - start.seconds

  if (diff < 60) return `${diff} seconds`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes`
  return `${Math.floor(diff / 3600)} hours`
}
