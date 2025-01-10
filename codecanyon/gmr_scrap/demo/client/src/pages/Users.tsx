import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { allUsers } from "../services/settingService";

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const subscribtion = allUsers().subscribe((users) => {
      setUsers(users);
    });

    return () => {
      subscribtion.unsubscribe();
    };
  }, []);

  const tableHeader = [
    {
      text: "Display Name",
      field: "displayName",
      render: (row: any) => <span>{row.displayName}</span>,
    },
    {
      text: "Email",
      field: "email",
      render: (row: any) => <span>{row.email}</span>,
    },
    {
      text: "Coin",
      field: "coin",
      render: (row: any) => <span>{row.coin || "0"}</span>,
    },
  ];
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {tableHeader.map((header) => (
                      <th key={header.text}>{header.text}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.uid}>
                      {tableHeader.map((header) => (
                        <td key={header.text}>{header.render(user)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
