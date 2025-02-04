import { User } from "firebase/auth";
import { Outlet, useOutletContext } from "react-router-dom";
import { AppNavbar, Sidebar } from "./";

export const DashboardLayout = () => {
  const user = useOutletContext<User>();

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
