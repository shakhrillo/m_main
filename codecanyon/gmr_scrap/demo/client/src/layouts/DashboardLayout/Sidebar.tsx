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
} from "@tabler/icons-react";
import { createElement, FC } from "react";
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

const SidebarItem: FC<NavItemProps> = ({
  to,
  icon,
  label,
  badge,
  className,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `sidebar-item ${className} ${isActive ? "active" : ""}`.trim()
    }
  >
    {createElement(icon, { size: 20, className: "me-2" })}
    <span className="label me-auto">{label}</span>
    {badge !== undefined && (
      <span className="badge text-bg-primary ms-auto">{badge}</span>
    )}
  </NavLink>
);

const Sidebar: FC = () => (
  <nav className="sidebar">
    <div className="sidebar-header">
      <img src={logo} alt="GMRS" className="sidebar-logo" />
    </div>
    <div className="sidebar-menu">
      {navItems.map((item) => (
        <SidebarItem key={item.to} {...item} />
      ))}
    </div>
  </nav>
);

export default Sidebar;
