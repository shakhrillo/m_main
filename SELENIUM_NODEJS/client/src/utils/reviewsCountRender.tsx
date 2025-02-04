export const reviewsCountRender = (review: any) => {
  const count = review.totalReviews || 0
  if (count === 0) return "N/A"

  return count === 1 ? `${count} review` : `${count} reviews`
}
