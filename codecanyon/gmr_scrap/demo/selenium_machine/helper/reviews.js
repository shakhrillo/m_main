const fs = require("fs");
const path = require("path");
const { WebDriver } = require("selenium-webdriver");
const { db, uploadFile } = require("../services/firebase");
const { isDriverActive } = require("../services/selenium");
const tag = process.env.TAG;

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const watchReviews = async (driver, data) => {
  // load extracter js file and convert it to string
  const extracterString = fs.readFileSync(
    path.join(__dirname, "extracter.js"),
    "utf8"
  );

  await driver.executeScript(extracterString);

  async function quitDriver() {
    if (isDriverActive(driver)) {
      console.log("Quitting driver");
      await driver.quit();
    }
  }

  let allElements = [];
  let extractedImages = [];
  let extractedOwnerReviewCount = 0;
  let extractedUserReviewCount = 0;
  let stopInterval = false;
  let extracted = 0;
  let reTries = 0;

  async function fetchIds() {
    try {
      allElements = await driver.executeScript(`return window["ids"] || []`);
      extractedImages = await driver.executeScript(
        `return window["extractedImages"] || []`
      );
      extractedOwnerReviewCount = await driver.executeScript(
        `return window["extractedOwnerReviewCount"] || 0`
      );
      extractedUserReviewCount = await driver.executeScript(
        `return window["extractedUserReviewCount"] || 0`
      );

      console.log("Total reviews:", allElements.length);
      if (extracted === allElements.length && reTries >= 10) {
        console.log("No new reviews found. Terminating interval.");
        stopInterval = true;
        await complete(
          {
            allElements,
            extractedImages,
            extractedOwnerReviewCount,
            extractedUserReviewCount,
          },
          data
        );
        await quitDriver();
        return;
      }

      if (extracted === allElements.length) {
        console.log("Scrolling to load more reviews");
        if (data.limit >= data.reviews && allElements.length > 0) {
          stopInterval = true;
          await complete(
            {
              allElements,
              extractedImages,
              extractedOwnerReviewCount,
              extractedUserReviewCount,
            },
            data
          );
          await quitDriver();
          return;
        }
        await driver.executeScript(`
          const parentEl = document.querySelector(".vyucnb").parentElement;
          const initEl = parentEl.children[0];
          initEl.scrollIntoView();
        `);
        await driver.sleep(1000);
        await driver.executeScript(`
          const parentEl = document.querySelector(".vyucnb").parentElement;
          const loaderEl = parentEl.children[parentEl.children.length - 1];
          loaderEl.scrollIntoView();
        `);
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
        await complete(
          {
            allElements,
            extractedImages,
            extractedOwnerReviewCount,
            extractedUserReviewCount,
          },
          data
        );
        await quitDriver();
        return; // Exit if the session is no longer valid
      }

      try {
        if (allElements?.length > data.limit) {
          console.log("Reached limit. Terminating interval.");
          stopInterval = true;
          await complete(
            {
              allElements,
              extractedImages,
              extractedOwnerReviewCount,
              extractedUserReviewCount,
            },
            data
          );
          await quitDriver();
          return;
        }
      } catch (error) {
        console.error("Error fetching IDs:", error);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      stopInterval = true;
      await complete(
        {
          allElements,
          extractedImages,
          extractedOwnerReviewCount,
          extractedUserReviewCount,
        },
        data
      );
      await quitDriver();
    } finally {
      // Re-schedule after execution
      if (!stopInterval) {
        setTimeout(fetchIds, 5000);
      }
    }
  }

  fetchIds();
};

const uploadReviewsAsFile = async (allElements, { reviewId }) => {
  if (!allElements?.length) return { csvUrl: "", jsonUrl: "" };

  const jsonContent = JSON.stringify(allElements, null, 2);
  const csvContent = [
    Object.keys(allElements[0]).join(","),
    ...allElements.map((el) => Object.values(el).join(",")),
  ].join("\n");

  const [csvUrl, jsonUrl] = await Promise.all([
    uploadFile(csvContent, `csv/${reviewId}.csv`),
    uploadFile(jsonContent, `json/${reviewId}.json`),
  ]);

  return { csvUrl, jsonUrl };
};

async function addReviews(allElements, refCollection) {
  if (!allElements.length) return;

  const collectionRef = db.collection(refCollection);
  const chunkSize = 500;

  await Promise.all(
    allElements.reduce((batches, _, i) => {
      if (i % chunkSize === 0) {
        const chunk = allElements.slice(i, i + chunkSize);
        const batch = db.batch();

        chunk.forEach((doc) => {
          batch.set(collectionRef.doc(), doc);
        });

        batches.push(batch.commit());
      }
      return batches;
    }, [])
  );
}

async function complete(
  {
    allElements,
    extractedImages,
    extractedOwnerReviewCount,
    extractedUserReviewCount,
  },
  { limit, reviewId, userId }
) {
  const { csvUrl, jsonUrl } = await uploadReviewsAsFile(allElements, {
    reviewId,
  });
  let totalReviews = allElements.length;
  allElements = allElements.slice(0, limit);
  await addReviews(allElements, `users/${userId}/reviews/${reviewId}/reviews`);
  await addReviews(
    extractedImages,
    `users/${userId}/reviews/${reviewId}/images`
  );
  await db.doc(`users/${userId}/reviews/${reviewId}`).update({
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

module.exports = {
  watchReviews,
};
