import React from "react"
import { NavLink } from "react-router-dom"
import logoImg from "../../assets/images/logo.svg"

const Sidebar: React.FC = () => {
  const navLinks = [
    { path: "/reviews", icon: "bi-search", label: "Scrap Reviews" },
    { path: "/user", icon: "bi-person-fill", label: "User" },
    { path: "/payments", icon: "bi-credit-card-fill", label: "Payments" },
    { path: "/settings", icon: "bi-gear-fill", label: "Settings" },
    { path: "/help", icon: "bi-question-circle-fill", label: "Help" },
    // { path: "/auth/logout", icon: "bi-box-arrow-left", label: "Logout" },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <NavLink to="/">
          <img src={logoImg} alt="logo" className="sidebar__header__logo" />
        </NavLink>
      </div>
      <div className="sidebar__body">
        <div className="sidebar__body__menu">
          {navLinks.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar__body__menu__item ${isActive ? "sidebar__body__menu__item--active" : ""}`
              }
            >
              <i className={`sidebar__icon ${icon}`}></i>
              <span className="sidebar__label">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="sidebar__footer">
        <NavLink
          to={"/auth/logout"}
          className={({ isActive }) =>
            `sidebar__body__menu__item ${isActive ? "sidebar__body__menu__item--active" : ""}`
          }
        >
          <i className="sidebar__icon bi-box-arrow-left"></i>
          <span className="sidebar__label">Logout</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
