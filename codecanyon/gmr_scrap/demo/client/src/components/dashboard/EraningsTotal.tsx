import { Card } from "react-bootstrap"
import { formatNumber } from "../../utils/formatNumber"
import { useEffect, useState } from "react"
import { getStatistics } from "../../services/statistics";

export const EraningsTotal = () => {
  const [earnings, setEarnings] = useState(0);
  
  useEffect(() => {
    const subscribtion = getStatistics("earnings").subscribe((data) => {
      setEarnings(data.total);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>Lifetime Earnings</Card.Title>
        <div className="display-5 mt-auto">
          ${formatNumber((earnings) / 100)}
        </div>
        {/* <small className="mt-auto">
          {checkEarningsTrend(earnings)}%{" "}
          {checkEarningsTrend(earnings) > 0 ? "increase" : "decrease"}{" "}
          in revenue since last month
        </small>
        <div className="position-absolute p-1 top-0 end-0 mt-2 me-2 rounded bg-light">
          {checkEarningsTrend(earnings) > 0 ? (
            <IconTrendingUp size={24} className="text-success" />
          ) : (
            <IconTrendingDown size={24} className="text-danger" />
          )}
        </div> */}
      </Card.Body>
    </Card>
  )
}