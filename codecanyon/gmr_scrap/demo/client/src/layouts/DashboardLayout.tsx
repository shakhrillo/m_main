import { Outlet, useOutletContext } from "react-router-dom";
import { AppNavbar, Sidebar } from "./";
import type { IUserInfo } from "../types/userInfo";
import { JSX } from "react";

/**
 * DashboardLayout component
 * @returns {JSX.Element}
 */
export const DashboardLayout = (): JSX.Element => {
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
