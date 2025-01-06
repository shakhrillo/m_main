import {
  IconChevronRight,
  IconCreditCard,
  IconSearch,
  IconServerBolt,
  IconSettings,
  IconUser,
  IconHelp,
  IconDashboard,
  IconInvoice,
  IconShield,
  IconWorldCheck,
  IconLayoutSidebarLeftCollapse,
} from "@tabler/icons-react";
import { createElement, FC, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  className?: string;
}

const navItems: NavItemProps[] = [
  { to: "/dashboard", icon: IconDashboard, label: "Dashboard" },
  { to: "/scrap", icon: IconSearch, label: "Scrap" },
  { to: "/reviews", icon: IconServerBolt, label: "Reviews", badge: 4 },
  { to: "/validates", icon: IconWorldCheck, label: "Validates" },
  { to: "/payments", icon: IconCreditCard, label: "Payment" },
  { to: "/invoice", icon: IconInvoice, label: "Invoice" },
  { to: "/users", icon: IconUser, label: "Users" },
  {
    to: "/security",
    icon: IconShield,
    label: "Security",
    className: "mt-auto",
  },
  {
    to: "/help",
    icon: IconHelp,
    label: "Help",
  },
  {
    to: "/settings",
    icon: IconSettings,
    label: "Settings",
  },
];

const Sidebar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className={`sidebar ${collapsed ? "sidebar-collapse" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="GMRS" className="sidebar-logo" />
        <button
          className="ms-auto btn p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <IconLayoutSidebarLeftCollapse size={30} />
        </button>
      </div>
      <div className="sidebar-menu">
        {navItems.map((item) => (
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${item.className} ${isActive ? "active" : ""}`.trim()
            }
          >
            {createElement(item.icon)}
            <span className="label me-auto">{item.label}</span>
            {item.badge !== undefined && (
              <span className="badge text-bg-primary ms-auto">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
