import { NavLink } from "react-router-dom"
import {
  IconSearch,
  IconServerBolt,
  IconCreditCard,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"
import { createElement } from "react"

const navItems = [
  { to: "/scrap", icon: IconSearch, label: "Scrap" },
  { to: "/reviews", icon: IconServerBolt, label: "Reviews" },
  { to: "/payments", icon: IconCreditCard, label: "Payments" },
  { to: "/settings", icon: IconSettings, label: "Settings" },
  { to: "/users", icon: IconUser, label: "Users" },
]

const Sidebar = () => (
  <div className="sidebar">
    {navItems.map(({ to, icon, label }) => (
      <NavLink key={to} to={to}>
        {createElement(icon, { size: 20 })}
        <span>{label}</span>
        <span className="badge text-bg-primary ms-auto">4</span>
      </NavLink>
    ))}
  </div>
)

export default Sidebar
