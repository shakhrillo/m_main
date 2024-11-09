import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const DashboardLayout: React.FC = () => {
  return (
    <div className="main">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
