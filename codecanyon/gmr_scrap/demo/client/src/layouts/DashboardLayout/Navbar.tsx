import { FC, use, useEffect, useState } from "react";
import { IconBell, IconCoins } from "@tabler/icons-react";
import { useFirebase } from "../../contexts/FirebaseProvider";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar: FC = () => {
  const { user, firestore } = useFirebase();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (user) {
      const docRef = doc(firestore, "users", user.uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("user data", data);
          setBalance(data.coinBalance);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

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
              <span className="text-warning fw-bold ms-2">{balance}</span>
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
