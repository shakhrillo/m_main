import { formatNumber } from "../../utils/formatNumber";
import { JSX, useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";

/**
 * UsersTotal component
 * @returns {JSX.Element} UsersTotal component
 */
export const UsersTotal = (): JSX.Element => {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const subscribtion = getStatistics("users").subscribe((data) => {
      setUsers(data.total);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <div>
      <div className="dashboard-title">Users</div>
      <div className="dashboard-graph">
        <h3 className="m-0">{formatNumber(users)}</h3>
      </div>
    </div>
  );
};
