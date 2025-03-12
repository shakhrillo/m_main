import { formatNumber } from "./formatNumber";

/**
 * Format amount to display
 * @param amount
 * @returns formatted amount
 */
export const formatAmount = (
  amount: number | string | undefined,
  currency?: string,
) => {
  if (!amount) {
    return 0;
  }

  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  if (!currency) {
    return formatNumber(amount / 100);
  }

  return `${formatNumber(amount / 100)} ${currency}`.toUpperCase();
};
