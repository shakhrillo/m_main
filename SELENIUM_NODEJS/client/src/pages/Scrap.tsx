import React from "react"
import { ReviewsForm } from "../components/reviews-form"

const Scrap: React.FC = () => {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 py-3 my-5">
        <h3 className="m-0">Scrap</h3>
        <button className="button button-lg button-success ml-auto">
          Coins 12 989
        </button>
      </div>
      <ReviewsForm />
    </div>
  )
}

export default Scrap
