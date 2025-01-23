import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { Stack } from "react-bootstrap";
import { IDockerContainer } from "../types/dockerContainer";
import formatNumber from "../utils/formatNumber";

/**
 * Display the ratings of a review
 * @param info The review information
 * @returns The ratings component
 */
export const Ratings = ({ container }: { container?: IDockerContainer }) => {
  if (!container || typeof container.rating !== "number") return null;

  const validRating = Math.max(0, Math.min(container.rating, 5));
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="ratings">
      <span>{validRating.toFixed(1)}</span>

      <div className="ratings-stars">
        {Array.from({ length: fullStars }).map((_, i) => (
          <IconStarFilled key={`full-${i}`} className="ratings-star" />
        ))}

        {halfStar && <IconStarHalfFilled className="ratings-star" />}

        {Array.from({ length: emptyStars }).map((_, i) => (
          <IconStar key={`empty-${i}`} className="ratings-star" />
        ))}
      </div>

      {"reviews" in container &&
        container.reviews &&
        `${formatNumber(container.reviews)} reviews`}
    </div>
  );
};
