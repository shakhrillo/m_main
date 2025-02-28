import { LineChart } from "../LineChart";
import { useEffect, useState, useCallback, useMemo } from "react";
import { paymentsData } from "../../services/paymentService";
import { formatTotalEarnings } from "../../utils/formatTotalEarnings";
import { filter, map } from "rxjs";
import type { IDockerContainer } from "../../types/dockerContainer";

interface IEarnings {
  id: string;
  date: string;
  total: number;
}

/**
 * Revenue component for the current month
 * @returns The revenue component
 */
export const RevenueGraph = () => {
  const [earnings, setEarnings] = useState<IEarnings[]>([]);

  const fetchPayments = useCallback(() => {
    const subscription = paymentsData({ type: ["charge.succeeded"] })
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IDockerContainer),
          })),
        ),
      )
      .subscribe((data) => setEarnings(formatTotalEarnings(data)));

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
          color: "#c8dceb",
        },
      ],
    }),
    [earnings],
  );

  return (
    <>
      <h4 className="dashboard-title">This Month's Revenue</h4>
      <div className="dashboard-graph">
        <LineChart {...chartData} />
      </div>
    </>
  );
};
