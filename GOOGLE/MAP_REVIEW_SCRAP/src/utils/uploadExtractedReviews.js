// const { batchWriteLargeArray, updateReview } = require("../controllers/reviewController");
const {
  batchWriteLargeArray,
  updateReview,
} = require("../controllers/reviewController");
const { uploadFile } = require("../services/storageService");
const filterallElements = require("./filter");

async function uploadExtractedReviews(userId, reviewId, allElements) {
  if (allElements.length > 0) {
    allElements = filterallElements(allElements);

    console.log("Total reviews:", allElements.length);

    try {
      const jsonFile = JSON.stringify(allElements, null, 2);
      const csvFile =
        Object.keys(allElements[0]).join(",") +
        "\n" +
        allElements
          .map((element) => Object.values(element).join(","))
          .join("\n");

      const csvUrl = await uploadFile(jsonFile, `json/${reviewId}.json`);
      const jsonUrl = await uploadFile(csvFile, `csv/${reviewId}.csv`);

      await batchWriteLargeArray(userId, reviewId, allElements);

      await updateReview(userId, reviewId, {
        status: "completed",
        csvUrl,
        jsonUrl,
        totalReviews: allElements.length,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error("Error in setExtractedDate function:", error);
      await updateReview(userId, reviewId, {
        status: "failed",
        error: error.message,
        completedAt: new Date(),
      });
    }
  } else {
    await updateReview(userId, reviewId, {
      status: "failed",
      error: "No reviews found",
      completedAt: new Date(),
    });
  }
}

module.exports = uploadExtractedReviews;
