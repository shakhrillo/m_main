import { IconBox, IconBoxMargin, IconBrandDocker, IconCreditCard, IconDashboard, IconHelp, IconInfoCircle, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconReceipt, IconSearch, IconServerBolt, IconSettings, IconShield, IconUser, IconWorldCheck } from "@tabler/icons-react";
import { createElement, useState } from "react";
import { NavLink } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import { Button } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { Logo } from "../components/Logo";

// Sidebar menu items
const menuSections = [
  {
    title: "Main",
    items: [
      { path: "/dashboard", icon: IconDashboard, label: "Dashboard" },
      { path: "/scrap", icon: IconSearch, label: "Scrap" },
    ],
  },
  {
    title: "Reviews",
    items: [
      {
        path: "/reviews",
        icon: IconServerBolt,
        label: "Reviews",
        badge: "4",
      },
      { path: "/validates", icon: IconWorldCheck, label: "Validates" },
    ],
  },
  {
    title: "Docker",
    items: [
      { path: "/containers", icon: IconBox, label: "Containers" },
      { path: "/images", icon: IconBoxMargin, label: "Images" },
      { path: "/docker", icon: IconBrandDocker, label: "Docker" },
    ],
  },
  {
    title: "Reports",
    items: [
      { path: "/payments", icon: IconCreditCard, label: "Buy Coins" },
      { path: "/receipts", icon: IconReceipt, label: "Receipts" },
    ],
  },
  {
    title: "Settings",
    items: [
      { path: "/users", icon: IconUser, label: "Users" },
      { path: "/settings", icon: IconSettings, label: "Settings" },
    ],
  },
  {
    title: "Help",
    items: [
      { path: "/security", icon: IconShield, label: "Security" },
      { path: "/help", icon: IconHelp, label: "Help" },
      { path: "/info", icon: IconInfoCircle, label: "Info" },
    ],
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "shadow-sm sidebar-collapsed" : ""}`}>
      <Scrollbar>
        <div className="sidebar-header">
          <Logo className="sidebar-logo" />
          <Button
            variant="link"
            className="ms-auto p-0"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {createElement(
              collapsed ? IconLayoutSidebarLeftExpand : IconLayoutSidebarLeftCollapse
            )}
          </Button>
        </div>

        <div className="sidebar-menu">
          {menuSections.map((section) => (
            <div className="sidebar-group" key={section.title}>
              <span className="sidebar-group-title">{section.title}</span>
              {section.items.map(({ path, icon, label, badge }) => (
                <NavLink key={path} to={path} className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}>
                  {createElement(icon, { size: 20 })}
                  <span className="me-auto">{label}</span>
                  {badge && <span className="badge text-bg-primary ms-auto">{badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};
