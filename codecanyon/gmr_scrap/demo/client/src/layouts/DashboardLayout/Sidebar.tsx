import { NavLink } from "react-router-dom"
import creditCardIcon from "../../assets/icons/credit-card.svg"
import searchIcon from "../../assets/icons/search.svg"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import settingsIcon from "../../assets/icons/settings.svg"
import usersIcon from "../../assets/icons/users.svg"

const navItems = [
  { to: "/scrap", icon: searchIcon, label: "Scrap" },
  { to: "/reviews", icon: serverBoltIcon, label: "Reviews" },
  { to: "/payments", icon: creditCardIcon, label: "Payments" },
  { to: "/settings", icon: settingsIcon, label: "Settings" },
  { to: "/users", icon: usersIcon, label: "Users" },
]

const Sidebar = () => (
  <div className="sidebar">
    {navItems.map(({ to, icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img src={icon} alt={`${label} icon`} />
        <span>{label}</span>
      </NavLink>
    ))}
  </div>
)

export default Sidebar
