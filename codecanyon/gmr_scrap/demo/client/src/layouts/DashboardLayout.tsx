import { Outlet, useOutletContext } from "react-router-dom";
import { AppNavbar, Sidebar } from "./";
import { IUserInfo } from "../types/userInfo";

export const DashboardLayout = () => {
  const user = useOutletContext<IUserInfo>();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <AppNavbar />
        <div className="dashboard-content">
          <Outlet context={user} />
        </div>
      </main>
    </div>
  );
};
