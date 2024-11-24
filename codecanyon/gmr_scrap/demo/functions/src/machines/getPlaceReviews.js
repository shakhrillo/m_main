const { submitScrapRequest } = require("../utils/apiUtils");

const getPlaceReview = async (event) => {
  const snapshot = event.data;
  if (!snapshot) return console.log("No data associated with the event");

  const review = snapshot.data();
  if (review.processed)
    return console.log("Review already processed, skipping...");

  const reviewResponse = await submitScrapRequest({
    ...review,
    reviewId: event.params.reviewId,
    userId: event.params.userId,
  });

  console.log("Review posted:", reviewResponse);

  await snapshot.ref.update({ ...reviewResponse, processed: true });
};

module.exports = getPlaceReview;
