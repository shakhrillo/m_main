import React from "react"
import { ReviewsForm } from "../components/reviews-form"
import { useMenu } from "../context/MenuContext/MenuContext"
import menuIcon from "../assets/icons/list.svg"

const Scrap: React.FC = () => {
  const { toggleMenu } = useMenu()
  return (
    <div className="col">
      <div className="row">
        <h1>Scrap</h1>
      </div>
      <ReviewsForm />
    </div>
  )
}

export default Scrap
