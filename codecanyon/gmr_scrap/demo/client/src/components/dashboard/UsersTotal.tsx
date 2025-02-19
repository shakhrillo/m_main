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
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>Lifetime Users</Card.Title>
        <div className="display-5 mt-auto">
          {formatNumber((users))}
        </div>
      </Card.Body>
    </Card>
  )
}