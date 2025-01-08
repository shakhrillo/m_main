import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../../components/Navbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
