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
    <>
      <div className="dashboard-title">
        Earnings
      </div>
      <div className="dashboard-graph">
        <div className="display-6 mt-auto">
          ${formatNumber((earnings) / 100)}
        </div>
      </div>
    </>
  )
}