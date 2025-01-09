import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { Table } from "../components/table";
import { allUsers } from "../services/settingService";

const Users: React.FC = () => {
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
              <Table tableHeader={tableHeader} tableBody={users}></Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
