import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { Stack } from "react-bootstrap";
import { IComment, IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";

/**
 * Display the ratings of a review
 * @param info The review information
 * @returns The ratings component
 */
export const Ratings = ({
  info,
  ...rest
}: {
  info?: IReview | IComment;
} & React.HTMLAttributes<HTMLDivElement>) => {
  if (!info || typeof info.rating !== "number") return null;

  const validRating = Math.max(0, Math.min(info.rating, 5));
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const iconSize = "reviews" in info && info.reviews ? 24 : 16;

  return (
    <Stack direction="horizontal" {...rest}>
      <span className="me-2">{validRating.toFixed(1)}</span>

      {Array.from({ length: fullStars }).map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={iconSize} color="#FFD700" />
      ))}

      {halfStar && <IconStarHalfFilled size={iconSize} color="#FFD700" />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <IconStar key={`empty-${i}`} size={iconSize} color="#FFD700" />
      ))}

      {"reviews" in info && info.reviews && (
        <span className="ms-2">({formatNumber(info.reviews)} reviews)</span>
      )}
    </Stack>
  );
};
