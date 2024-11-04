import React from 'react';
import { NavLink } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";

const Sidebar: React.FC = () => {
  const navLinks = [
    { path: "/reviews", icon: "bi-search", label: "Scrap Reviews" },
    { path: "/usage", icon: "bi-bar-chart", label: "Usage" },
    { path: "/user", icon: "bi-person", label: "User" },
    { path: "/payments", icon: "bi-credit-card", label: "Payments" },
    { path: "/settings", icon: "bi-gear", label: "Settings" },
    { path: "/help", icon: "bi-question-circle", label: "Help" },
    { path: "/logout", icon: "bi-box-arrow-left", label: "Logout", additionalClass: "sidebar__link--logout" },
  ];

  return (
    <div className="dashboard__sidebar">
      <NavLink to="/" className="sidebar__logo-link">
        <img src={logoImg} alt="logo" className="sidebar__logo" />
      </NavLink>
      <div className="list-group sidebar__nav-list">
        {navLinks.map(({ path, icon, label, additionalClass = "" }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `list-group-item sidebar__nav-item ${additionalClass} ${isActive ? "sidebar__nav-item--active" : ""}`
            }
          >
            <i className={`sidebar__icon ${icon}`}></i>
            <span className="sidebar__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
