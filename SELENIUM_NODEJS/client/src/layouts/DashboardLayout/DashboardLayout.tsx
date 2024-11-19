import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const DashboardLayout: React.FC = () => {
  return (
    <div className="main">
      <Sidebar />
      <div className="container">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
