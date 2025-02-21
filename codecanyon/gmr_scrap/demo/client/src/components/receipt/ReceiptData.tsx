import { Badge, Stack } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { formatAmount, formatNumber, formatTimestamp } from "../../utils";

interface IReceiptData {
  receipt: any;
}

export const ReceiptData = ({ receipt }: IReceiptData) => {
  return (
    <div className="receipt-data">
      <Stack direction="horizontal" gap={2} className="justify-content-between">
        <Stack direction="horizontal" gap={2}>
          {`${formatAmount(receipt.amount)} ${receipt?.currency?.toUpperCase()}`}
          <Badge bg={receipt.status === "succeeded" ? "success" : "danger"} className="text-capitalize">
            {receipt.status}
          </Badge>
        </Stack>
        {formatTimestamp(receipt.createdAt)}
      </Stack>
      <NavLink className={"h6"} to={`/receipts/${receipt.id}`}>
        {formatNumber(receipt.metadata.amount)} Coins
      </NavLink>
      <Stack direction="horizontal" gap={2} className="text-muted">
        <div>{receipt?.payment_method_details?.card?.brand}</div>
        <div>**** **** **** {receipt?.payment_method_details?.card?.last4}</div>
        <div>{receipt?.payment_method_details?.card?.exp_month}/{receipt?.payment_method_details?.card?.exp_year}</div>
        <div>{receipt?.payment_method_details?.card?.funding}</div>
        <div>{receipt?.payment_method_details?.card?.country}</div>
      </Stack>
    </div>
  );
}