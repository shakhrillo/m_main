import { NavLink } from "react-router-dom";
import {
  IconSearch,
  IconServerBolt,
  IconCreditCard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { createElement, FC } from "react";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number; // Optional badge
}

const navItems: NavItemProps[] = [
  { to: "/scrap", icon: IconSearch, label: "Scrap" },
  { to: "/reviews", icon: IconServerBolt, label: "Reviews", badge: 4 },
  { to: "/payments", icon: IconCreditCard, label: "Payments" },
  { to: "/settings", icon: IconSettings, label: "Settings" },
  { to: "/users", icon: IconUser, label: "Users" },
];

const SidebarItem: FC<NavItemProps> = ({ to, icon, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `sidebar-item d-flex align-items-center p-2 ${
        isActive ? "active" : ""
      }`.trim()
    }
  >
    {createElement(icon, { size: 20, className: "me-3" })}
    <span className="label">{label}</span>
    {badge !== undefined && (
      <span className="badge text-bg-primary ms-auto">{badge}</span>
    )}
  </NavLink>
);

const Sidebar: FC = () => (
  <nav className="sidebar bg-white">
    <div className="sidebar-header">
      <h5 className="text-primary">GMR Scrap</h5>
    </div>
    <div className="sidebar-menu">
      {navItems.map((item) => (
        <SidebarItem key={item.to} {...item} />
      ))}
    </div>
  </nav>
);

export default Sidebar;
