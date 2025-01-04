import { FC } from "react";
import { IconBell, IconCoins } from "@tabler/icons-react";

const Navbar: FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100">
      <div className="container-fluid">
        <ul className="ms-auto navbar-nav">
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">
              <IconBell size={22} />
              <span className="badge bg-info rounded-pill mt-n2 ms-n2 position-absolute">
                3
              </span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <IconCoins size={22} className="text-warning" />
              <span className="text-warning fw-bold ms-2">500</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              John Doe
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
