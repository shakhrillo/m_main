import { Timestamp } from "firebase/firestore";

export const formatTimestamp = (
  timestamp: Timestamp | null,
): { date: string; time: string } => {
  if (!timestamp) return { date: "", time: "" };

  const date = timestamp.toDate();
  const [year, month, day] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ];
  const [hours, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];

  const pad = (num: number) => String(num).padStart(2, "0");

  return {
    date: `${year}/${pad(month)}/${pad(day)}`,
    time: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
};
