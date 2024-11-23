import { Timestamp } from "firebase/firestore"

export const formatTimestamp = (timestamp: Timestamp): string =>
  timestamp?.seconds
    ? new Date(timestamp.seconds * 1000)
        .toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", " ")
    : ""
