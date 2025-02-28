import { format } from "date-fns";

/**
 * Formats the total earnings for the current month
 * @param data The data to format
 * @returns The formatted total earnings
 */
export const formatTotalEarnings = (data: any[]) => {
  const currentDate = new Date();
  const monthKey = format(currentDate, "MMM y");
  const currentDay = currentDate.getDate();

  const dateArray = Array.from({ length: currentDay }, (_, i) => ({
    id: i.toString(), 
    date: `${i + 1} ${format(currentDate, "MMM")}`,
    total: 0,
  }));

  data.forEach((item) => {
    const itemDate = new Date(item.createdAt.seconds * 1000);
    const day = itemDate.getDate();

    if (format(itemDate, "MMM y") === monthKey && day <= currentDay) {
      dateArray[day - 1].total += item.amount / 100;
    }
  });

  return dateArray;
};
