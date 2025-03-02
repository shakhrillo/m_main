import { LineChart } from "../LineChart";
import { useState, useEffect, JSX } from "react";
import { usersList } from "../../services/settingService";
import { formatTotalUsers } from "../../utils/formatTotalUsers";
import { filter, map } from "rxjs";
import type { IUserInfo } from "../../types/userInfo";

/**
 * Users component
 * @returns {JSX.Element} Users component
 */
export const UsersGraph = (): JSX.Element => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const subscribtion = usersList()
      .pipe(
        filter((snapshot) => !!snapshot),
        map((snapshot) => {
          return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as IUserInfo),
          }));
        }),
      )
      .subscribe((users) => {
        setUsers(formatTotalUsers(users));
      });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="dashboard-title">This month's users</div>
      <div className="dashboard-graph">
        <LineChart
          labels={users.map((e) => e.date)}
          datasets={[
            {
              label: "This month's users",
              data: users.map((e) => e.total),
              color: "#3e2c41",
            },
          ]}
        />
      </div>
    </>
  );
};
