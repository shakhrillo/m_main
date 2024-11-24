import { NavLink } from "react-router-dom"
import logoImg from "../../assets/images/logo.svg"
import searchIcon from "../../assets/icons/search.svg"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import userIcon from "../../assets/icons/user.svg"
import usersIcon from "../../assets/icons/users.svg"
import creditCardIcon from "../../assets/icons/credit-card.svg"
import settingsIcon from "../../assets/icons/settings.svg"
import helpIcon from "../../assets/icons/help.svg"
import logoutIcon from "../../assets/icons/logout.svg"
import { useMenu } from "../../context/MenuContext/MenuContext"
import hideMenuIcon from "../../assets/icons/x-lg.svg"

const navLinks = [
  { path: "/scrap", label: "Scrap", icon: searchIcon },
  { path: "/reviews", label: "Reviews", icon: serverBoltIcon },
  { path: "/user", label: "User", icon: userIcon },
  { path: "/users", label: "Users", icon: usersIcon },
  { path: "/payments", label: "Payments", icon: creditCardIcon },
  { path: "/settings", label: "Settings", icon: settingsIcon },
  { path: "/help", label: "Help", icon: helpIcon },
  {
    path: "/auth/logout",
    label: "Logout",
    icon: logoutIcon,
    className: "mt-auto",
  },
]

const Sidebar = () => {
  const { isMenuOpen, toggleMenu } = useMenu()
  return (
    <div className={`sidebar-container ${isMenuOpen ? "" : "sidebar-hidden"}`}>
      <div className={`sidebar sidebar-${isMenuOpen ? "showed" : "hidden"}`}>
        <div className="d-flex align-items-center justify-space-between">
          <NavLink to="/">
            <img src={logoImg} alt="logo" className="logo" />
          </NavLink>
          <button onClick={toggleMenu} className="sidebar-hide-btn button">
            <img src={hideMenuIcon} alt="Hide Menu" />
          </button>
        </div>
        {navLinks.map(({ path, icon, label, className }, index) => (
          <NavLink
            key={index}
            to={path}
            onClick={toggleMenu}
            className={({ isActive }) =>
              `${isActive ? "active" : ""} ${className}`
            }
          >
            {icon && <img src={icon} alt="icon" />}
            {label}
          </NavLink>
        ))}
      </div>
      <div
        className={`sidebar-overlay ${isMenuOpen ? "" : "sidebar-hidden"}`}
        onClick={toggleMenu}
      ></div>
    </div>
  )
}

export default Sidebar
