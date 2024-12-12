const fs = require("fs");
const path = require("path");
const { WebDriver } = require("selenium-webdriver");
const { db, uploadFile } = require("../services/firebase");
const { isDriverActive } = require("../services/selenium");
const { quitDriver } = require("../services/selenium");
const { batchWriteLargeArray } = require("../services/firebase");
const { getScriptContent } = require("../services/scripts");
const tag = process.env.TAG;

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const watchReviews = async (driver, data) => {
  let allElements = [];
  let extractedImages = [];
  let extractedOwnerReviewCount = 0;
  let extractedUserReviewCount = 0;

  const extracterString = await getScriptContent("extracter.js", "helper");
  const getExtractedValues = await getScriptContent(
    "getExtractedValues.js",
    "scripts"
  );
  const scrollToLoader = getScriptContent("scrollToLoader.js", "scripts");
  const scrollToContainer = getScriptContent("scrollToContainer.js", "scripts");

  await driver.executeScript(extracterString);

  let stopInterval = false;
  let extracted = 0;
  let reTries = 0;

  async function fetchIds() {
    try {
      const extractedValues = await driver.executeScript(getExtractedValues);
      allElements = extractedValues.allElements;
      extractedImages = extractedValues.extractedImages;
      extractedOwnerReviewCount = extractedValues.extractedOwnerReviewCount;
      extractedUserReviewCount = extractedValues.extractedUserReviewCount;

      console.log("Total reviews:", allElements.length);
      if (extracted === allElements.length && reTries >= 10) {
        console.log("No new reviews found. Terminating interval.");
        stopInterval = true;
        await complete();
        await quitDriver(driver);
        return;
      }

      if (extracted === allElements.length) {
        console.log("Scrolling to load more reviews");
        if (data.limit >= data.reviews && allElements.length > 0) {
          stopInterval = true;
          await complete();
          await quitDriver(driver);
          return;
        }
        await driver.executeScript(scrollToLoader);
        await driver.sleep(1000);
        await driver.executeScript(scrollToContainer);
        await driver.sleep(1000);
        reTries++;
      } else {
        reTries = 0;
      }

      extracted = allElements.length;

      await db.doc(`users/${data.userId}/reviews/${data.reviewId}`).update({
        updatedAt: +new Date(),
        totalReviews: allElements.length,
        totalImages: extractedImages.length,
        totalOwnerReviews: extractedOwnerReviewCount,
        totalUserReviews: extractedUserReviewCount,
      });

      if (!(await isDriverActive(driver))) {
        console.error("Driver session is invalid. Terminating interval.");
        stopInterval = true;
        await complete();
        await quitDriver(driver);
        return; // Exit if the session is no longer valid
      }

      try {
        if (allElements?.length > data.limit) {
          console.log("Reached limit. Terminating interval.");
          stopInterval = true;
          await complete();
          await quitDriver(driver);
          return;
        }
      } catch (error) {
        console.error("Error fetching IDs:", error);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      stopInterval = true;
      await complete();
      await quitDriver(driver);
    } finally {
      // Re-schedule after execution
      if (!stopInterval) {
        setTimeout(fetchIds, 5000);
      }
    }
  }

  async function complete() {
    let csvUrl = "";
    let jsonUrl = "";
    if (allElements?.length) {
      const jsonContent = JSON.stringify(allElements, null, 2);
      const csvContent = [
        Object.keys(allElements[0]).join(","),
        ...allElements.map((el) => Object.values(el).join(",")),
      ].join("\n");
      csvUrl = await uploadFile(csvContent, `csv/${data.reviewId}.csv`);
      jsonUrl = await uploadFile(jsonContent, `json/${data.reviewId}.json`);
    }

    let totalReviews = allElements.length;
    allElements = allElements.slice(0, data.limit);

    await batchWriteLargeArray(
      `users/${data.userId}/reviews/${data.reviewId}/reviews`,
      allElements
    );
    await batchWriteLargeArray(
      `users/${data.userId}/reviews/${data.reviewId}/images`,
      extractedImages
    );

    await db.doc(`users/${data.userId}/reviews/${data.reviewId}`).update({
      updatedAt: +new Date(),
      completedAt: +new Date(),
      csvUrl,
      jsonUrl,
      totalReviews: allElements.length,
      totalReviewsScraped: totalReviews,
      totalImages: extractedImages.length,
      totalOwnerReviews: extractedOwnerReviewCount,
      totalUserReviews: extractedUserReviewCount,
    });

    await db.doc(`machines/${tag}`).update({
      totalReviews: allElements.length,
      totalImages: extractedImages.length,
      totalOwnerReviews: extractedOwnerReviewCount,
      totalUserReviews: extractedUserReviewCount,
    });

    console.log("Review completed");
  }

  fetchIds();
};

module.exports = {
  watchReviews,
};
