export const formatTotalUsers = (data: any[], startDate?: Date) => {
  const dateArray: Record<string, { date: string; total: number }> = {};
  const currentDate = new Date();

  if (!startDate) {
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
  }

  const tempDate = new Date(startDate);
  while (tempDate <= currentDate) {
    const monthKey = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, "0")}`;
    dateArray[monthKey] = {
      date: monthKey,
      total: 0,
    };
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  const grouped = data.reduce((acc: Record<string, number>, item) => {
    const date = new Date(item.createdAt.seconds * 1000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey] += 1;

    return acc;
  }, {});

  Object.keys(dateArray).forEach((monthKey) => {
    if (grouped[monthKey]) {
      dateArray[monthKey].total = grouped[monthKey];
    }
  });

  return Object.values(dateArray);
};
