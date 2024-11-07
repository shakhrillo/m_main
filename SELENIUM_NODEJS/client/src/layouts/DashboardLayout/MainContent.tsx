import React from "react"
import { Outlet } from "react-router-dom"
import DashboardTest from "./DashboardTest"

const MainContent: React.FC = () => {
  return (
    <div className="dashboard__content">
      {/* <DashboardTest /> */}
      <Outlet />
    </div>
  )
}

export default MainContent
