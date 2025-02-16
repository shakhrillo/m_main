import { Card } from "react-bootstrap"
import { LineChart } from "../LineChart"
import { useEffect, useState } from "react";
import { paymentsData } from "../../services/paymentService";
import { formatTotalEarnings } from "../../utils/formatTotalEarnings";

/**
 * Revenue component for the current month
 * @returns The revenue component
 */
export const Revenue = () => {
    const [earnings, setEarnings] = useState([] as any[]);

    useEffect(() => {
        const subscription = paymentsData({type: ["charge.succeeded"]}).subscribe((data) => setEarnings(formatTotalEarnings(data)));
    
        return () => {
          subscription.unsubscribe();
        };
    }, []);

    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    This month's revenue
                </Card.Title>
                <LineChart
                    labels={earnings.map((e) => e.date)}
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