import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "./Sidebar";
import { User } from "firebase/auth";

const DashboardLayout: React.FC = () => {
  const user = useOutletContext<User>();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <Outlet context={user} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
