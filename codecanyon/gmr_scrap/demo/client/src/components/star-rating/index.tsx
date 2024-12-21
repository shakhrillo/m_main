import starFilledIcon from "../../assets/icons/star-filled.svg"
import starIcon from "../../assets/icons/star.svg"
import starHalfIcon from "../../assets/icons/star-half.svg"

interface StarRatingProps {
  rating: number
  size?: number
}

const StarRating = ({ rating, size }: StarRatingProps) => {
  if (!rating || typeof rating !== "number") {
    return null
  }

  const filledStarsCount = Math.floor(rating)

  const isHalfStar = () => {
    const decimal = parseFloat(rating.toString().split(".")[1])
    return decimal >= 5
  }

  return (
    <div className="d-flex">
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
          width={`${size}px`}
          height={`${size}px`}
        />
      ))}
    </div>
  )
}

export default StarRating
