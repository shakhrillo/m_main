import { IconBell } from "@tabler/icons-react";
import React, { FC } from "react";

const Navbar: FC = () => {
  return (
    <nav className="navbar">
      <form>
        <ul>
          <li>EN</li>
          <li>
            <a href="">
              <IconBell size={20} />
            </a>
          </li>
        </ul>
        <div className="navbar__user">
          <a href="#">
            <img
              src="https://mighty.tools/mockmind-api/content/human/104.jpg"
              alt="User Avatar"
            />
          </a>
          <div>
            <h6>Anna Adame</h6>
            <small>Consumer</small>
          </div>
        </div>
      </form>
    </nav>
  );
};

export default Navbar;
