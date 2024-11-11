import starFilledIcon from "../../assets/icons/star-filled.svg"
import starIcon from "../../assets/icons/star.svg"
import starHalfIcon from "../../assets/icons/star-half.svg"

interface StarRatingProps {
  rating: string
}

const StarRating = ({ rating }: StarRatingProps) => {
  if (!rating) return null

  const filledStarsCount = Math.floor(
    parseFloat(rating.match(/[\d.]+/)?.[0] || "0"),
  )

  const isHalfStar = () => {
    const secondDigit = parseInt(rating[2], 10)
    return secondDigit
  }

  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={
            index < filledStarsCount
              ? starFilledIcon
              : index === filledStarsCount && isHalfStar()
                ? starHalfIcon
                : starIcon
          }
          alt="star"
        />
      ))}
    </div>
  )
}

export default StarRating
