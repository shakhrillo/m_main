import { Timestamp } from "firebase/firestore"

export const spentTime = (placeInfo: any): string => {
  const start = placeInfo.createdAt as Timestamp
  const end = placeInfo.completedAt as Timestamp
  let diff = 0
  if (!start || !end) {
    return "N/A"
  } else {
    diff = end.seconds - start.seconds
  }

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  return `${Math.floor(diff / 3600)}h`
}
