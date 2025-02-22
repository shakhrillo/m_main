import { Card } from "react-bootstrap"
import { formatNumber } from "../../utils/formatNumber"
import { useEffect, useState } from "react"
import { getStatistics } from "../../services/statistics";

export const UsersTotal = () => {
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
    <div className="d-flex flex-column h-100">
      <h5>Lifetime Users</h5>
      <div className="display-6 mt-auto">
        {formatNumber((users))}
      </div>
    </div>
  )
}