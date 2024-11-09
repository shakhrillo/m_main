import React from "react";
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";

const navLinks = [
  { path: "/scrap", icon: "bi-cloud-arrow-up-fill", label: "Scrap" },
  { path: "/reviews", icon: "bi-search", label: "Scrap Reviews" },
  { path: "/user", icon: "bi-person-fill", label: "User" },
  { path: "/payments", icon: "bi-credit-card-fill", label: "Payments" },
  { path: "/settings", icon: "bi-gear-fill", label: "Settings" },
  { path: "/help", icon: "bi-question-circle-fill", label: "Help" },
  // { path: "/auth/logout", icon: "bi-box-arrow-left", label: "Logout" },
];

const NavItem: React.FC<{ path: string, icon: string, label: string }> = ({ path, icon, label }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `sidebar__menu-item ${isActive ? "sidebar__menu-item--active" : ""}`
      }
    >
      <i className={`sidebar__icon ${icon}`}></i>
      <span className="sidebar__label">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <NavLink to="/">
          <img src={logoImg} alt="logo" className="sidebar__logo" />
        </NavLink>
      </div>

      <div className="sidebar__body">
        <div className="sidebar__menu">
          {navLinks.map(({ path, icon, label }) => (
            <NavItem key={path} path={path} icon={icon} label={label} />
          ))}
        </div>
      </div>

      <div className="sidebar__footer">
        <NavItem path="/auth/logout" icon="bi-box-arrow-left" label="Logout" />
      </div>
    </div>
  );
};

export default Sidebar;
