const { submitScrapInfo } = require("../utils/apiUtils");

const getPlaceOverview = async (event) => {
  const snapshot = event.data;

  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const review = snapshot.data();
  const info = await submitScrapInfo({
    ...review,
    reviewId: event.params.reviewId,
    userId: event.params.userId,
  });

  console.log("Info posted:", info);
};

module.exports = getPlaceOverview;
