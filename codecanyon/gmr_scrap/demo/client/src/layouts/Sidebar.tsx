import {
  IconBox,
  IconBoxMargin,
  IconBrandDocker,
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
  IconTool,
  IconUser,
  IconWorldCheck,
} from "@tabler/icons-react";
import { createElement, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Scrollbar } from "react-scrollbars-custom";
import { Button } from "react-bootstrap";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Scrollbar>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <Button
            variant="link"
            className="ms-auto p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {createElement(
              collapsed
                ? IconLayoutSidebarLeftExpand
                : IconLayoutSidebarLeftCollapse,
            )}
          </Button>
        </div>
        <div className="sidebar-menu">
          <div className="sidebar-group">
            <span className="sidebar-group-title">Main</span>
            <NavLink
              to={"/dashboard"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {createElement(IconDashboard, { size: 20 })}
              <span className="me-auto">Dashboard</span>
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
            <span className="sidebar-group-title">Reviews</span>
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
            <span className="sidebar-group-title">Docker</span>
            <NavLink
              to={"/containers"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {createElement(IconBox, { size: 20 })}
              <span className="me-auto">Containers</span>
            </NavLink>
            <NavLink
              to={"/images"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {createElement(IconBoxMargin, { size: 20 })}
              <span className="me-auto">Images</span>
            </NavLink>
            <NavLink
              to={"/docker"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {createElement(IconBrandDocker, { size: 20 })}
              <span className="me-auto">Docker</span>
            </NavLink>
          </div>
          <div className="sidebar-group">
            <span className="sidebar-group-title">Reports</span>
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
            <span className="sidebar-group-title">Settings</span>
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
              to={"/settings"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {createElement(IconSettings, { size: 20 })}
              <span className="me-auto">Settings</span>
            </NavLink>
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-title">Help</span>
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
      </Scrollbar>
    </div>
  );
};
