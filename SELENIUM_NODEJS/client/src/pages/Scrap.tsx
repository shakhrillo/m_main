import React from "react"
import { ReviewsForm } from "../components/reviews-form"

const Scrap: React.FC = () => {
  return (
    <div>
      <h2>Scrap</h2>
      <div className="card">
        <div className="card-body">
          <ReviewsForm />
        </div>
      </div>
    </div>
  )
}

export default Scrap
