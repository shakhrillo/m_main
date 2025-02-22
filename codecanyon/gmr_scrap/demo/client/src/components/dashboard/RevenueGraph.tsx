import { Card } from "react-bootstrap"
import { LineChart } from "../LineChart"
import { useEffect, useState } from "react";
import { paymentsData } from "../../services/paymentService";
import { formatTotalEarnings } from "../../utils/formatTotalEarnings";
import { filter, map, take } from "rxjs";
import { IDockerContainer } from "../../types/dockerContainer";

/**
 * Revenue component for the current month
 * @returns The revenue component
 */
export const RevenueGraph = () => {
  const [earnings, setEarnings] = useState([] as any[]);

  useEffect(() => {
    const subscription = paymentsData({type: ["charge.succeeded"]})
    .pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IDockerContainer }))),
      take(1),
    )
    .subscribe((data) => setEarnings(formatTotalEarnings(data)));

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card>
      <Card.Body>
        <Card.Title>This month's revenue</Card.Title>
        <LineChart labels={earnings.map((e) => e.date)}
          datasets={[{
            label: "Revenue",
            data: earnings.map((e) => e.total),
            color: "#3e2c41",
          }]}
        />
      </Card.Body>
    </Card>
  )
}