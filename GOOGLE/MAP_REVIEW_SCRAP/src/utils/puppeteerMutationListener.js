const logger = require("../config/logger");
const fetchReviewDetails = require("./fetchReviewDetails");

const puppeteerMutationListener = async (records) => {
  let allElements = [];
  logger.log(`Starting to process ${records.length} records.`);

  try {
    // Create an array of promises for parallel execution
    const fetchPromises = records.map(async (record) => {
      try {
        const result = await fetchReviewDetails(page, record);
        logger.info(
          `Fetched details for record ${record.id}: JSON.stringify(result)`
        );
        allElements.push(result);
      } catch (error) {
        logger.error(`Error fetching details for record ${record.id}:`, error);
      }
    });

    // Wait for all fetch requests to complete
    await Promise.all(fetchPromises);

    logger.log(`Successfully processed ${allElements.length} records.`);
  } catch (error) {
    logger.error(
      "An error occurred during the mutation listener execution:",
      error
    );
  }

  return allElements;
};

module.exports = puppeteerMutationListener;
