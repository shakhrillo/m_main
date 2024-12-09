import { Timestamp } from "firebase/firestore"

type PlaceInfo = {
  createdAt?: { _seconds: number; _nanoseconds: number }
  updatedAt?: { _seconds: number; _nanoseconds: number }
}

export const spentTime = (placeInfo: any): string => {
  if (!placeInfo?.createdAt || !placeInfo?.updatedAt) {
    return "N/A"
  }

  const startSeconds = placeInfo.createdAt._seconds
  const endSeconds = placeInfo.updatedAt._seconds

  const diffInSeconds = endSeconds - startSeconds

  if (diffInSeconds < 0) {
    return "Invalid time range"
  }

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  return `${Math.floor(diffInSeconds / 3600)}h`
}
