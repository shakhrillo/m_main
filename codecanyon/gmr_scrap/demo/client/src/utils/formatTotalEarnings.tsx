export const formatTotalEarnings = (data: any[], startDate?: Date) => {
  const dateArray: Record<string, { date: string; total: number }> = {};
  const currentDate = new Date();

  // Default start date to three months ago if not provided
  if (!startDate) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
  }

  // Populate the dateArray with months from startDate to currentDate
  const tempDate = new Date(startDate);
  while (tempDate <= currentDate) {
    const monthKey = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
    dateArray[monthKey] = {
      date: monthKey,
      total: 0,
    };
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  // Group the input data by month and calculate earnings
  const grouped = data.reduce((acc: Record<string, number>, item) => {
    const date = new Date(item.createdAt.seconds * 1000); // Assuming `createdAt.seconds` is a UNIX timestamp
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey] += item.amount / 100; // Convert amount to dollars or desired currency

    return acc;
  }, {});

  // Merge grouped data into dateArray
  Object.keys(dateArray).forEach((monthKey) => {
    if (grouped[monthKey]) {
      dateArray[monthKey].total = grouped[monthKey];
    }
  });

  // Convert the result into an array
  return Object.values(dateArray);
};
