import { NavLink } from "react-router-dom"
import cloudIcon from "../../assets/icons/cloud.svg"
import creditCardIcon from "../../assets/icons/credit-card.svg"
import usageIcon from "../../assets/icons/device-cd-card.svg"
import infoIcon from "../../assets/icons/info-circle.svg"
import searchIcon from "../../assets/icons/search.svg"
import serverBoltIcon from "../../assets/icons/server-bolt.svg"
import settingsIcon from "../../assets/icons/settings.svg"
import usersIcon from "../../assets/icons/users.svg"

const Sidebar = () => {
  return (
    <div className="sidebar">
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
        <li>
          <NavLink
            to={"/info"}
            className={({ isActive }) => ` ${isActive ? "active" : ""}`}
          >
            <img src={infoIcon} alt="icon" />
            Info
          </NavLink>
        </li>
      </ul>
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
    </div>
  )
}

export default Sidebar
