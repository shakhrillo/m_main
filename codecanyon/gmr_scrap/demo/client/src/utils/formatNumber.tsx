/**
 * Formats a number or numeric string with commas.
 * @param value The number or string to format.
 * @returns The formatted number as a string.
 */
export const formatNumber = (value: number | string | undefined): string => {
  const num = Number(value);
  return isNaN(num) ? "0" : num.toLocaleString();
}