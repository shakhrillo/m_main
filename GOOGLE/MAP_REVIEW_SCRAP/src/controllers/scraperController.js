const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { uploadFile } = require("../services/storageService");
const wait = require("../utils/wait");
const { launchBrowser, openPage } = require("../utils/browser");
const filterallElements = require("../utils/filter");
const { batchWriteLargeArray, updateReview } = require("./reviewController");
const { getUser, updateUser, createUserUsage } = require("./userController");
const clickReviewTab = require("../utils/clickReviewTab");
const sortReviews = require("../utils/sortReviews");
const enableRequestInterception = require("./enableRequestInterception");
const {
  scrollAndCollectElements,
} = require("../utils/scrollAndCollectElements");
const { firestore } = require("../services/firebaseAdmin");
const fetchReviewDetails = require("../utils/fetchReviewDetails");

// Define a temporary directory in your project (e.g., ./temp)
const tempDir = path.join(__dirname, "temp");

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

let allElements = [];
let page;

async function puppeteerMutationListener(records, uid, pushId) {
  console.log("Record:", records.length);
  console.log("Saved:", allElements.length);

  for (const record of records) {
    await fetchReviewDetails(page, record)
      .then(async (result) => {
        allElements.push(result);
      })
      .catch((error) => {
        console.error("Error fetching review details:", error);
      });
  }
}

async function waitForArrayGrowth(array, targetLength, timeout = 90000) {
  let initialLength = array.length;
  let stableDuration = 0;
  const checkInterval = 100; // Check every 100ms

  while (array.length <= targetLength) {
    if (array.length === initialLength) {
      stableDuration += checkInterval;
      if (stableDuration >= timeout) {
        console.log(
          "Timeout exceeded: Array length did not change for 10 seconds."
        );
        return;
      }
    } else {
      initialLength = array.length; // Update to new length if it changes
      stableDuration = 0; // Reset stable duration counter
    }

    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  console.log(
    `Array length exceeded the target. Current length: ${array.length}`
  );
}

async function setExtractedDate(userId, reviewId, allElements) {
  if (allElements.length > 0) {
    allElements = filterallElements(allElements);

    console.log("Total reviews:", allElements.length);

    try {
      const jsonFileName = path.join(tempDir, `${reviewId}.json`);
      const csvFileName = path.join(tempDir, `${reviewId}.csv`);

      // Write the JSON file
      fs.writeFileSync(jsonFileName, JSON.stringify(allElements, null, 2));

      // Define the CSV writer
      const csvWriter = createCsvWriter({
        path: csvFileName,
        header: Object.keys(allElements[0]).map((key) => ({
          id: key,
          title: key,
        })), // Adjust headers based on your data structure
      });

      // Write the CSV file
      await csvWriter.writeRecords(allElements);

      await uploadFile(fs.readFileSync(jsonFileName), `json/${reviewId}.json`);
      await uploadFile(fs.readFileSync(csvFileName), `csv/${reviewId}.csv`);

      fs.unlinkSync(jsonFileName);
      fs.unlinkSync(csvFileName);

      await batchWriteLargeArray(userId, reviewId, allElements);

      await updateReview(userId, reviewId, {
        status: "completed",
        csvUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/csv/${reviewId}.csv`,
        jsonUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET}/json/${reviewId}.json`,
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

async function main({ url, userId, reviewId, limit, sortBy }) {
  try {
    allElements = [];
    const browser = await launchBrowser();
    page = await openPage(browser, url);

    await page.setCacheEnabled(false);

    page.exposeFunction("puppeteerMutationListener", puppeteerMutationListener);

    await page.evaluate((variable) => {
      window.uid = variable;
    }, userId);

    await page.evaluate((variable) => {
      window.pushId = variable;
    }, reviewId);

    const title = await page.title();
    console.log("Title:", title);

    await updateReview(userId, reviewId, {
      title,
      // createdAt: new Date(),
      status: "in-progress",
      token: "",
    });

    await enableRequestInterception(page, [
      ".css",
      "googleusercontent",
      "preview",
      "analytics",
      "ads",
      "fonts",
      "/maps/vt",
    ]);

    await clickReviewTab(page);
    await wait(2000);
    await sortReviews(page, sortBy);
    await wait(2000);
    await scrollAndCollectElements(page, userId, reviewId, limit);

    // await tillstorIdJson length exceeds limit
    await waitForArrayGrowth(allElements, limit);
    // Wait for scroll to finish
    // await wait(5000);

    allElements = allElements.slice(0, limit);

    await page.close();
    await browser.close();

    await setExtractedDate(userId, reviewId, allElements);

    return allElements;
  } catch (error) {
    await setExtractedDate(userId, reviewId, allElements);

    await updateReview(userId, reviewId, {
      status: "failed",
      error: error.message,
      completedAt: new Date(),
    });

    console.error("Error in main function:", error);
  }
}

// Export the main function for Google Cloud Functions
module.exports = main;
