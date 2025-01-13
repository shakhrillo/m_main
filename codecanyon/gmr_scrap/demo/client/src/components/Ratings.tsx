import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { Stack } from "react-bootstrap";
import { IReview } from "../services/scrapService";
import formatNumber from "../utils/formatNumber";

/**
 * Display the ratings of a review
 * @param info The review information
 * @returns The ratings component
 */
export const Ratings = ({ info }: { info?: IReview }) => {
  if (!info || typeof info.rating !== "number") return null;

  const validRating = Math.max(0, Math.min(info.rating, 5));
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <Stack direction="horizontal">
      <span className="me-2">{validRating.toFixed(1)}</span>

      {Array.from({ length: fullStars }).map((_, i) => (
        <IconStarFilled key={`full-${i}`} size={20} color="#FFD700" />
      ))}

      {halfStar && <IconStarHalfFilled size={20} color="#FFD700" />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <IconStar key={`empty-${i}`} size={20} color="#FFD700" />
      ))}

      <span className="ms-2">({formatNumber(info.reviews)} reviews)</span>
    </Stack>
  );
};
