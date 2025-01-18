import formatNumber from "./formatNumber";

/**
 * Format amount to display
 * @param amount
 * @returns formatted amount
 */
export const formatAmount = (amount: number | string | undefined) => {
  if (!amount) {
    return 0;
  }

  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  return formatNumber(amount / 100);
};
