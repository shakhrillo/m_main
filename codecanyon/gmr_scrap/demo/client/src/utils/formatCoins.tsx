/**
 * Format a number to a string with commas.
 * @param number The number to format.
 * @returns The formatted number.
 */
function formatNumber(number: number | undefined | null): string {
  if (!number) {
    return "0";
  }

  return number.toLocaleString();
}

export default formatNumber;
