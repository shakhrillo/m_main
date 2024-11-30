const { deleteMachine } = require("../utils/apiUtils");

const watchReview = async (event) => {
  const previousDocument = event.data.before.data();
  const document = event.data.after.data();
  const status = document.status;

  if (status === "completed" && previousDocument.status !== "completed") {
    const reviewId = event.params.reviewId;
    const userId = event.params.userId;
    const buildTag = `comments_${userId}_${reviewId}`.toLowerCase();
    // const buildTag = document.buildTag;
    console.log("Removing machine", buildTag);
    // await deleteMachine({
    //   buildTag: buildTag,
    // });
  }
};

module.exports = watchReview;
