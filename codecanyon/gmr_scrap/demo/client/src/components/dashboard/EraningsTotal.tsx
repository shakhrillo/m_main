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
    <div className="d-flex flex-column h-100">
      <h5>Lifetime Earnings</h5>
      <div className="display-6 mt-auto">
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
    </div>
  )
}