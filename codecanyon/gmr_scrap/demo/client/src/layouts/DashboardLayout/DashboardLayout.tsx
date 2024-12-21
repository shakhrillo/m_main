import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

const DashboardLayout: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </>
  )
}

export default DashboardLayout
