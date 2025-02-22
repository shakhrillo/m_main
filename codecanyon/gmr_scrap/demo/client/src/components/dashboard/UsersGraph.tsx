import { LineChart } from "../LineChart";
import { useState, useEffect } from "react";
import { usersList } from "../../services/settingService";
import { formatTotalUsers } from "../../utils/formatTotalUsers";
import { filter, map, take } from "rxjs";
import { IUserInfo } from "../../types/userInfo";

/**
 * Users component
 */
export const UsersGraph = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const subscribtion = usersList().pipe(
      filter((snapshot) => !!snapshot),
      map((snapshot) => {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as IUserInfo }));
      }),
      take(1),
    ).subscribe((users) => {
      setUsers(formatTotalUsers(users));
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <>
      <h5>This month's users</h5>
      <LineChart
        labels={users.map((e) => e.date)}
        datasets={[{
          label: "This month's users",
          data: users.map((e) => e.total),
          color: "#3e2c41",
        }]}
      />
    </>
  )
};