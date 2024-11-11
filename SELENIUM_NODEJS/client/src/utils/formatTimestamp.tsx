import { Timestamp } from "firebase/firestore"

export const formatTimestamp = (timestamp: Timestamp): string =>
  timestamp?.seconds
    ? new Date(timestamp.seconds * 1000)
        .toLocaleString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .replace(",", " -")
    : ""
