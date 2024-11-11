import React from "react"
import starIcon from "../../assets/icons/star.svg"
import starFiledIcon from "../../assets/icons/star-filled.svg"

interface StarRatingProps {
  rating: string
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5

  const matched = rating.match(/[\d.]+/)
  const extractedNumber = matched ? parseFloat(matched[0]) : 0
  const floorNumber = Math.floor(extractedNumber)

  return (
    <div className="stars">
      {Array.from({ length: totalStars }, (v, i) =>
        i < floorNumber ? (
          <img key={i} src={starFiledIcon} alt="star" /> // Filled star
        ) : (
          <img key={i} src={starIcon} alt="star" /> // Filled star
        ),
      )}
    </div>
  )
}

export default StarRating
