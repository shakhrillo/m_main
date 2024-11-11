import React from "react"
import { ReviewsForm } from "../components/reviews-form"

const Scrap: React.FC = () => {
  return (
    <div>
      <h2>Scrap</h2>
      <div className="card">
        <ReviewsForm />
      </div>
    </div>
  )
}

export default Scrap
