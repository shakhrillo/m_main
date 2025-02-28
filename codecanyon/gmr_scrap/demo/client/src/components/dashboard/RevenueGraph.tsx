import { LineChart } from "../LineChart";
import { useEffect, useState, useCallback, useMemo } from "react";
import { paymentsData } from "../../services/paymentService";
import { formatTotalEarnings } from "../../utils/formatTotalEarnings";
import { filter, map } from "rxjs";
import { Timestamp } from "firebase/firestore";

interface IEarnings {
  id: string;
  date: string;
  total: number;
}

const REVENUE_COLOR = "#043b5c";
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_AGO = Timestamp.fromMillis(Date.now() - 30 * MILLISECONDS_IN_A_DAY);

/**
 * Revenue component for the current month
 * @returns The revenue component
 */
export const RevenueGraph = () => {
  const [earnings, setEarnings] = useState<IEarnings[]>([]);

  const fetchPayments = useCallback(() => {
    const subscription = paymentsData({
      type: ["charge.succeeded"],
      from: THIRTY_DAYS_AGO
    })
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) => formatTotalEarnings(snapshot))
      )
      .subscribe((data) => setEarnings(data));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(fetchPayments, []);

  const chartData = useMemo(
    () => ({
      labels: earnings.map((e) => e.date),
      datasets: [
        {
          label: "Revenue",
          data: earnings.map((e) => e.total),
          color: REVENUE_COLOR,
        },
      ],
    }),
    [earnings],
  );

  return (
    <>
      <h4 className="dashboard-title">
        Last 30 days revenue
      </h4>
      <div className="dashboard-graph">
        <LineChart {...chartData} />
      </div>
    </>
  );
};
