import { format } from "date-fns";

export const formatTotalUsers = (data: any[]) => {
  const currentDate = new Date();
  const monthKey = format(currentDate, "MMM y");
  const currentDay = currentDate.getDate();
  
  const dateArray = Array.from({ length: currentDay }, (_, i) => ({
    date: `${i + 1} ${format(currentDate, "MMM")}`,
    total: 0,
  }));

  // Calculate total users for each day up to the current day
  data.forEach((item) => {
    const itemDate = new Date(item.createdAt.seconds * 1000);
    const day = itemDate.getDate();
    
    if (format(itemDate, "MMM y") === monthKey && day <= currentDay) {
      dateArray[day - 1].total += 1;
    }
  });

  return dateArray;
};
