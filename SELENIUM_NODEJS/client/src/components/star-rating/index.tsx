import React from "react"

interface StarRatingProps {
  rating: string
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5

  const matched = rating.match(/[\d.]+/)
  const extractedNumber = matched ? parseFloat(matched[0]) : 0
  const floorNumber = Math.floor(extractedNumber)

  return (
    <div className="star-rating d-flex small">
      {Array.from({ length: totalStars }, (v, i) =>
        i < floorNumber ? (
          <i key={i} className="bi-star-fill" style={{ color: "#ffc107" }}></i> // Filled star
        ) : (
          <i key={i} className="bi-star" style={{ color: "#ffc107" }}></i> // Outlined star
        ),
      )}
    </div>
  )
}

export default StarRating
