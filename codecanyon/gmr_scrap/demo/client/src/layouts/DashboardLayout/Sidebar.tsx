import {
  IconCreditCard,
  IconDashboard,
  IconHelp,
  IconInfoCircle,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconReceipt,
  IconSearch,
  IconServerBolt,
  IconSettings,
  IconShield,
  IconUser,
  IconWorldCheck,
} from "@tabler/icons-react";
import { createElement, FC, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // useEffect(() => {
  //   const dashboardSidebar = document.querySelector(".dashboard-layout");
  //   dashboardSidebar?.classList.toggle("dashboard-minimize", collapsed);
  // }, [collapsed]);

  return (
    <nav className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="logo" className="sidebar-logo" />
        <button
          className="ms-auto btn p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {createElement(
            collapsed
              ? IconLayoutSidebarLeftExpand
              : IconLayoutSidebarLeftCollapse,
            {
              size: 30,
              stroke: 1.5,
            },
          )}
        </button>
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-group">
          <span className="sidebar-group-title">MAIN</span>
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconDashboard, { size: 20 })}
            <span className="me-auto">Dashboard</span>
            <span className="badge text-bg-primary ms-auto">4</span>
          </NavLink>

          <NavLink
            to={"/scrap"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconSearch, { size: 20 })}
            <span className="me-auto">Scrap</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-group-title">REVIEWS</span>
          <NavLink
            to={"/reviews"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconServerBolt, { size: 20 })}
            <span className="me-auto">Reviews</span>
            <span className="badge text-bg-primary ms-auto">4</span>
          </NavLink>

          <NavLink
            to={"/validates"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconWorldCheck, { size: 20 })}
            <span className="me-auto">Validates</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-group-title">REPORTS</span>
          <NavLink
            to={"/payments"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconCreditCard, { size: 20 })}
            <span className="me-auto">Buy Coins</span>
          </NavLink>

          <NavLink
            to={"/receipts"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconReceipt, { size: 20 })}
            <span className="me-auto">Receipts</span>
          </NavLink>
        </div>

        <div className="sidebar-group">
          <span className="sidebar-group-title">SETTINGS</span>
          <NavLink
            to={"/users"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconUser, { size: 20 })}
            <span className="me-auto">Users</span>
          </NavLink>

          <NavLink
            to={"/security"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconShield, { size: 20 })}
            <span className="me-auto">Security</span>
          </NavLink>

          <NavLink
            to={"/help"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconHelp, { size: 20 })}
            <span className="me-auto">Help</span>
          </NavLink>

          <NavLink
            to={"/settings"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconSettings, { size: 20 })}
            <span className="me-auto">Settings</span>
          </NavLink>

          <NavLink
            to={"/info"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(IconInfoCircle, { size: 20 })}
            <span className="me-auto">Info</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
