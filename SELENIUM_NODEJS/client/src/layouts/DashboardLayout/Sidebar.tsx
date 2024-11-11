import { NavLink } from "react-router-dom"
import logoImg from "../../assets/images/logo.svg"
import searchIcon from "../../assets/icons/search.svg"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import userIcon from "../../assets/icons/user.svg"
import creditCardIcon from "../../assets/icons/credit-card.svg"
import settingsIcon from "../../assets/icons/settings.svg"
import helpIcon from "../../assets/icons/help.svg"
import logoutIcon from "../../assets/icons/logout.svg"

const navLinks = [
  { path: "/scrap", label: "Scrap", icon: searchIcon },
  { path: "/reviews", label: "Scrap Reviews", icon: serverBoltIcon },
  { path: "/user", label: "User", icon: userIcon },
  { path: "/payments", label: "Payments", icon: creditCardIcon },
  { path: "/settings", label: "Settings", icon: settingsIcon },
  { path: "/help", label: "Help", icon: helpIcon },
  { path: "/auth/logout", label: "Logout", icon: logoutIcon },
]

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/">
        <img src={logoImg} alt="logo" className="logo" />
      </NavLink>

      {navLinks.map(({ path, icon, label }, index) => (
        <NavLink
          key={index}
          to={path}
          className={({ isActive }) => `${isActive ? "active" : ""}`}
        >
          {icon && <img src={icon} alt="icon" />}
          {label}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar
