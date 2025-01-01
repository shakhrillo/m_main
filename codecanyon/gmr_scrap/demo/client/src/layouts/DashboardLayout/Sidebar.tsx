import { NavLink } from "react-router-dom";
import {
  IconSearch,
  IconServerBolt,
  IconCreditCard,
  IconSettings,
  IconUser,
  IconChevronRight,
  IconMessageSearch,
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
      `sidebar-item ${isActive ? "active" : ""}`.trim()
    }
  >
    {createElement(icon, { size: 20, className: "me-2" })}
    <span className="label me-auto">{label}</span>
    {badge !== undefined && (
      <span className="badge text-bg-primary ms-auto">{badge}</span>
    )}
    {createElement(IconChevronRight, { size: 16, className: "ms-2" })}
  </NavLink>
);

const Sidebar: FC = () => (
  <nav className="sidebar">
    <div className="sidebar-header">
      <h5 className="sidebar-title">
        {/* <IconMessageSearch size={30} /> */}
        GMRS
      </h5>
      <small className="sidebar-subtitle">Google Maps Review Scraper</small>
    </div>
    <div className="sidebar-menu">
      {navItems.map((item) => (
        <SidebarItem key={item.to} {...item} />
      ))}
    </div>
  </nav>
);

export default Sidebar;
