import type { Timestamp } from "firebase/firestore";

export interface IPaymentsQuery {
  uid?: string;
  receiptId?: string;
  type?: string[];
  limit?: number;
  from?: Timestamp;
}
