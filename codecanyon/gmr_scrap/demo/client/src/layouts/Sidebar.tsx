import {
  IconBox,
  IconBoxMargin,
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
import { createElement, useEffect, useState } from "react";
import { NavLink, useOutletContext } from "react-router-dom";
import { Scrollbar } from "react-scrollbars-custom";
import { Button } from "react-bootstrap";
import { Logo } from "../components/Logo";
import type { IUserInfo } from "../types/userInfo";

const menuSections = [
  {
    title: "Main",
    id: "main",
    items: [
      {
        path: "/dashboard",
        id: "dashboard",
        icon: IconDashboard,
        label: "Dashboard",
      },
      { path: "/scrap", id: "scrap", icon: IconSearch, label: "Scrap" },
    ],
  },
  {
    title: "Reviews",
    id: "reviews",
    items: [
      {
        path: "/validates",
        id: "validates",
        icon: IconWorldCheck,
        label: "Validates",
      },
      {
        path: "/reviews",
        id: "reviews",
        icon: IconServerBolt,
        label: "Reviews",
      },
    ],
  },
  {
    title: "Docker",
    id: "docker",
    items: [
      {
        path: "/containers",
        id: "containers",
        icon: IconBox,
        label: "Containers",
      },
      { path: "/images", id: "images", icon: IconBoxMargin, label: "Images" },
    ],
  },
  {
    title: "Reports",
    id: "reports",
    items: [
      {
        path: "/payments",
        id: "payments",
        icon: IconCreditCard,
        label: "Buy Coins",
      },
      {
        path: "/receipts",
        id: "receipts",
        icon: IconReceipt,
        label: "Receipts",
      },
    ],
  },
  {
    title: "Settings",
    id: "settings",
    items: [
      { path: "/users", id: "users", icon: IconUser, label: "Users" },
      {
        path: "/settings",
        id: "settings",
        icon: IconSettings,
        label: "Settings",
      },
    ],
  },
  {
    title: "Help",
    id: "help",
    items: [
      {
        path: "/security",
        id: "security",
        icon: IconShield,
        label: "Security",
      },
      { path: "/help", id: "help", icon: IconHelp, label: "Help" },
      { path: "/info", id: "info", icon: IconInfoCircle, label: "Info" },
    ],
  },
];

export const Sidebar = () => {
  const user = useOutletContext<IUserInfo>();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`sidebar ${collapsed ? "shadow-sm sidebar-collapsed" : ""}`}
    >
      <Scrollbar>
        <div className="sidebar-header">
          <Logo className="sidebar-logo" />
          <Button
            variant="link"
            className="ms-auto p-0"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {createElement(
              collapsed
                ? IconLayoutSidebarLeftExpand
                : IconLayoutSidebarLeftCollapse,
            )}
          </Button>
        </div>

        <div className="sidebar-menu">
          {menuSections
            .filter((section) => {
              if (section.id === "docker" && !user?.isAdmin) return false;
              if (section.id === "settings" && !user?.isAdmin) return false;
              return true;
            })
            .map((section) => {
              if (section.id === "main" && !user?.isAdmin) {
                return {
                  ...section,
                  items: section.items.filter(
                    (item) => item.id !== "dashboard",
                  ),
                };
              }
              return section;
            })
            .map((section) => (
              <div className="sidebar-group" key={section.title}>
                <span className="sidebar-group-title">{section.title}</span>
                {section.items.map(({ path, icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? "active" : ""}`
                    }
                  >
                    {createElement(icon, { size: 20 })}
                    <span className="me-auto">{label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
        </div>
      </Scrollbar>
    </div>
  );
};
