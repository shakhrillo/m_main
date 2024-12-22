import React from "react"
import { ReviewsForm } from "../components/reviews-form"
import searchIcon from "../assets/icons/search.svg"

const Scrap: React.FC = () => {
  return (
    <div className="col">
      <div className="row">
        <div className="d-flex gap-2">
          <div className="rounded bg-light d-flex justify-content-center align-items-center reviews__icon">
            <img src={searchIcon} alt="icon" width={"18px"} />
          </div>
          <h4>Scrap</h4>
        </div>
        {/* <h1>Scrap</h1> */}
      </div>
      <ReviewsForm />
    </div>
  )
}

export default Scrap
