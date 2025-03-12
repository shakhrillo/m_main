import { formatNumber } from "../../utils/formatNumber";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";

/**
 * ValidatesTotal component
 * @returns {JSX.Element} ValidatesTotal component
 */
export const ValidatesTotal = (): JSX.Element => {
  const [validates, setValidates] = useState(0);

  useEffect(() => {
    const subscribtion = getStatistics("info").subscribe((data) => {
      setValidates(data.total);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="dashboard-title">Validates</div>
      <div className="dashboard-graph">
        <h3 className="m-0">{formatNumber(validates)}</h3>
      </div>
    </div>
  );
};
