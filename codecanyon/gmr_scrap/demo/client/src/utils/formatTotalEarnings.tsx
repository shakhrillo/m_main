import { format, addMonths, subMonths, isBefore, isSameMonth } from "date-fns";

export const formatTotalEarnings = (
  data: any[],
  startDate: Date = subMonths(new Date(), 6),
) => {
  const currentDate = new Date();
  const dateArray: Record<string, { date: string; total: number }> = {};

  // Populate the dateArray with months from startDate to currentDate
  for (
    let tempDate = startDate;
    isBefore(tempDate, currentDate) || isSameMonth(tempDate, currentDate);
    tempDate = addMonths(tempDate, 1)
  ) {
    const monthKey = format(tempDate, "MMM y");
    dateArray[monthKey] = { date: monthKey, total: 0 };
  }

  // Group data by month and calculate earnings
  const grouped = data.reduce((acc: Record<string, number>, item) => {
    const monthKey = format(new Date(item.createdAt.seconds * 1000), "MMM y");
    acc[monthKey] = (acc[monthKey] || 0) + item.amount;
    return acc;
  }, {});

  // Merge grouped data into dateArray
  Object.keys(dateArray).forEach((monthKey) => {
    if (grouped[monthKey]) {
      dateArray[monthKey].total = grouped[monthKey];
    }
  });

  return Object.values(dateArray);
};
