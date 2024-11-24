import React from "react"
import { ReviewsForm } from "../components/reviews-form"
import { useMenu } from "../context/MenuContext/MenuContext"
import menuIcon from "../assets/icons/list.svg"

const Scrap: React.FC = () => {
  const { toggleMenu } = useMenu()
  return (
    <div>
      <div className="d-flex align-items-center gap-3 py-3 my-5 ">
        <button className="sidebar-toggle-btn button" onClick={toggleMenu}>
          <img src={menuIcon} alt="menu-icon" />
        </button>
        <h3 className="m-0">Scrap</h3>
      </div>
      <ReviewsForm />
    </div>
  )
}

export default Scrap
