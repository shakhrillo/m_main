import { NavLink } from "react-router-dom"
import logoImg from "../../assets/images/logo.svg"
import searchIcon from "../../assets/icons/search.svg"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import userIcon from "../../assets/icons/user.svg"
import usersIcon from "../../assets/icons/users.svg"
import creditCardIcon from "../../assets/icons/credit-card.svg"
import settingsIcon from "../../assets/icons/settings.svg"
import helpIcon from "../../assets/icons/help.svg"
import infoIcon from "../../assets/icons/info-circle.svg"
import usageIcon from "../../assets/icons/device-cd-card.svg"
import logoutIcon from "../../assets/icons/logout.svg"
import { useMenu } from "../../context/MenuContext/MenuContext"
import hideMenuIcon from "../../assets/icons/x-lg.svg"
import cloudIcon from "../../assets/icons/cloud.svg"

const navLinks = [
  { path: "/scrap", label: "Scrap", icon: searchIcon },
  { path: "/reviews", label: "Reviews", icon: serverBoltIcon },
  { path: "/user", label: "User", icon: userIcon },
  { path: "/users", label: "Users", icon: usersIcon },
  { path: "/payments", label: "Payments", icon: creditCardIcon },
  { path: "/machines", label: "Machines", icon: cloudIcon },
  { path: "/settings", label: "Settings", icon: settingsIcon },
  { path: "/help", label: "Help", icon: helpIcon },
  { path: "/info", label: "Info", icon: infoIcon },
  { path: "/usage", label: "Usage", icon: usageIcon },
  {
    path: "/auth/logout",
    label: "Logout",
    icon: logoutIcon,
  },
]

const Sidebar = () => {
  const { isMenuOpen, toggleMenu } = useMenu()
  return (
    <div className={`sidebar-container ${isMenuOpen ? "" : "sidebar-hidden"}`}>
      <div className={`sidebar sidebar-${isMenuOpen ? "showed" : "hidden"}`}>
        {/* <div className="d-flex align-items-center justify-space-between">
          <NavLink to="/">
            <img src={logoImg} alt="logo" className="logo" />
          </NavLink>

          <button onClick={toggleMenu} className="sidebar-hide-btn button">
            <img src={hideMenuIcon} alt="Hide Menu" />
          </button>
        </div> */}
        <ul className="list-unstyled m-0">
          <li>
            <NavLink
              to={"/scrap"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={searchIcon} alt="icon" />
              Scrap
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/reviews"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={serverBoltIcon} alt="icon" />
              Reviews
            </NavLink>
          </li>
        </ul>
        <hr />
        <ul className="list-unstyled m-0">
          <li>
            <NavLink
              to={"/machines"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={cloudIcon} alt="icon" />
              Machines
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/usage"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={usageIcon} alt="icon" />
              Usage
            </NavLink>
          </li>
        </ul>
        <hr />
        <ul className="list-unstyled m-0">
          <li>
            <NavLink
              to={"/payments"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={creditCardIcon} alt="icon" />
              Payments
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/settings"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={settingsIcon} alt="icon" />
              Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/users"}
              className={({ isActive }) => ` ${isActive ? "active" : ""}`}
            >
              <img src={usersIcon} alt="icon" />
              Users
            </NavLink>
          </li>
        </ul>
        <ul className="d-none list-unstyled">
          {navLinks.map(({ path, icon, label }, index) => (
            <li key={index}>
              <NavLink
                key={index}
                to={path}
                onClick={toggleMenu}
                className={({ isActive }) => ` ${isActive ? "active" : ""}`}
              >
                {icon && <img src={icon} alt="icon" />}
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* {navLinks.map(({ path, icon, label, className }, index) => (
          <NavLink
            key={index}
            to={path}
            onClick={toggleMenu}
            className={({ isActive }) => `${isActive ? "active" : ""}`}
          >
            {icon && <img src={icon} alt="icon" />}
            {label}
          </NavLink>
        ))} */}
      </div>
      <div
        className={`sidebar-overlay ${isMenuOpen ? "" : "sidebar-hidden"}`}
        onClick={toggleMenu}
      ></div>
    </div>
  )
}

export default Sidebar
