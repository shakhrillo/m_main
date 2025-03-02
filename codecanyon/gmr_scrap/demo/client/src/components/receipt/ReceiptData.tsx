import { Badge, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { formatAmount, formatNumber, formatTimestamp } from "../../utils";
import type { JSX } from "react";

interface IReceiptData {
  receipt: any;
}

/**
 * ReceiptData component
 * @param {IReceiptData} props
 * @returns {JSX.Element}
 */
export const ReceiptData = ({ receipt }: IReceiptData): JSX.Element => {
  return (
    <div className="receipt-data">
      <Stack direction="horizontal" gap={2} className="justify-content-between">
        <Stack direction="horizontal" gap={2}>
          {`${formatAmount(receipt.amount)} ${receipt?.currency?.toUpperCase()}`}
          <Badge
            bg={receipt.status === "succeeded" ? "success" : "danger"}
            className="text-capitalize"
            pill
          >
            {receipt.status}
          </Badge>
        </Stack>
        <div className="receipt-time">{formatTimestamp(receipt.createdAt)}</div>
      </Stack>
      <NavLink to={`/receipts/${receipt.id}`} className="receipt-label">
        {formatNumber(receipt.metadata.amount)} Coins
      </NavLink>
      <Stack direction="horizontal" gap={2} className="text-muted">
        <div>{receipt?.payment_method_details?.card?.brand}</div>
        <div>**** **** **** {receipt?.payment_method_details?.card?.last4}</div>
        <div>
          {receipt?.payment_method_details?.card?.exp_month}/
          {receipt?.payment_method_details?.card?.exp_year}
        </div>
        <div>{receipt?.payment_method_details?.card?.funding}</div>
        <div>{receipt?.payment_method_details?.card?.country}</div>
      </Stack>
    </div>
  );
};
