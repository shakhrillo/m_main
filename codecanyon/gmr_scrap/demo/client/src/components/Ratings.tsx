import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { Stack } from "react-bootstrap";
import { IComment, IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";
import { IDockerContainer } from "../types/dockerContainer";

/**
 * Display the ratings of a review
 * @param info The review information
 * @returns The ratings component
 */
export const Ratings = ({
  container,
  ...rest
}: {
  container?: IDockerContainer;
} & React.HTMLAttributes<HTMLDivElement>) => {
  if (!container || typeof container.rating !== "number") return null;

  const validRating = Math.max(0, Math.min(container.rating, 5));
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const iconSize = "reviews" in container && container.reviews ? 16 : 16;

  return (
    <Stack direction="horizontal" {...rest}>
      <small className="me-2">{validRating.toFixed(1)}</small>

      {Array.from({ length: fullStars }).map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={iconSize} color="#FFD700" />
      ))}

      {halfStar && <IconStarHalfFilled size={iconSize} color="#FFD700" />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <IconStar key={`empty-${i}`} size={iconSize} color="#FFD700" />
      ))}

      {"reviews" in container && container.reviews && (
        <small className="ms-2">
          ({formatNumber(container.reviews)} reviews)
        </small>
      )}
    </Stack>
  );
};
