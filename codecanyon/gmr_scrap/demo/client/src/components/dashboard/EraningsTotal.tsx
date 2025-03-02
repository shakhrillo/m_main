import { JSX, useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";
import { formatAmount } from "../../utils";

/**
 * EraningsTotal component
 * @returns {JSX.Element}
 */
export const EraningsTotal = (): JSX.Element => {
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
    <div>
      <div className="dashboard-title">Earnings</div>
      <div className="dashboard-graph">
        <h3 className="m-0">${formatAmount(earnings)}</h3>
      </div>
    </div>
  );
};
