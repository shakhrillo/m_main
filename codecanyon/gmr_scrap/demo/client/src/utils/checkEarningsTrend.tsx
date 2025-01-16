/**
 * Check if the earnings trend and return as the percentage of increase or decrease
 * @param data - The earnings data, expected to be an array of objects with a `total` property
 * @returns The percentage change in earnings, rounded to the nearest whole number
 */
export const checkEarningsTrend = (data: { total: number }[] = []): number => {
  if (data.length < 2) {
    return 0;
  }

  const last = data[data.length - 1].total;
  const first = data[data.length - 2].total;

  if (first === 0) {
    return last > 0 ? 100 : -100;
  }

  return Math.ceil(((last - first) / first) * 100);
};
