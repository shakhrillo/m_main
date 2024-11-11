import { Timestamp } from "firebase/firestore"

export const spentTime = (start: Timestamp, end: Timestamp): string => {
  if (!start || !end) return "0s"
  const diff = end.seconds - start.seconds

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  return `${Math.floor(diff / 3600)}h`
}
