import { formatNumber } from "../../utils/formatNumber";
import { useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";

export const ValidatesTotal = () => {
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
    <>
      <div className="dashboard-title">Validates</div>
      <div className="dashboard-graph">
        <h1 className="m-0">{formatNumber(validates)}</h1>
      </div>
    </>
  );
};
