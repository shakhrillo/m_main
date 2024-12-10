const fs = require("fs");
const path = require("path");
const { Builder, By, until, WebDriver } = require("selenium-webdriver");
const { db, uploadFile } = require("../services/firebase");

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const sortReviews = async (driver, sortBy = "Newest") => {
  const sortButton = await driver.findElement(
    By.css(
      'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
    )
  );

  await sortButton.click();
  await driver.sleep(1000);

  const menuItems = await driver.findElements(By.css('[role="menuitemradio"]'));
  // console.log("Menu items:", menuItems);
  for (const item of menuItems) {
    const text = await item.getText();
    console.log("Item text:", text);

    if (text === sortBy) {
      await item.click();
      await driver.sleep(1000);
      return;
    }
  }

  console.log("Sort by not found");
};

/**
 * Get the initial reviews
 * @param {WebDriver} driver
 */
const getInitialReviews = async (driver) => {
  return await driver.executeScript(`
    const reviewsContainer = document.querySelector(".vyucnb")?.parentElement?.lastChild?.previousSibling;

    const reviewIds = [];
    const reviewsContainerChildren = reviewsContainer.children;
    for (const reviewElm of reviewsContainerChildren) {
      const reviewId = reviewElm.getAttribute("data-review-id");
      if (reviewId) {
        reviewIds.push(reviewId);
      }
    }

    return reviewIds;
  `);
};

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

  const isDriverActive = async (driver) => {
    try {
      await driver.getTitle(); // Simple command to test if the session is valid
      return true;
    } catch (error) {
      return false;
    }
  };

  async function quitDriver() {
    if (isDriverActive(driver)) {
      console.log("Quitting driver");
      await driver.quit();
    }
  }

  let allElements = [];
  let stopInterval = false;
  let extracted = 0;
  let reTries = 0;

  async function fetchIds() {
    try {
      allElements = await driver.executeScript(`return window["ids"] || []`);

      console.log("Total reviews:", allElements.length);
      if (extracted === allElements.length && reTries >= 10) {
        console.log("No new reviews found. Terminating interval.");
        stopInterval = true;
        await complete(allElements, data);
        await quitDriver();
        return;
      }

      if (extracted === allElements.length) {
        console.log("Scrolling to load more reviews");
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
        completedAt: +new Date(),
        totalReviews: allElements.length,
      });

      if (!(await isDriverActive(driver))) {
        console.error("Driver session is invalid. Terminating interval.");
        stopInterval = true;
        await complete(allElements, data);
        await quitDriver();
        return; // Exit if the session is no longer valid
      }

      try {
        if (allElements?.length > data.limit) {
          console.log("Reached limit. Terminating interval.");
          stopInterval = true;
          await complete(allElements, data);
          await quitDriver();
          return;
        }
      } catch (error) {
        console.error("Error fetching IDs:", error);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      stopInterval = true;
      await complete(allElements, data);
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

async function addReviews(allElements, { userId, reviewId }) {
  if (!allElements.length) return;

  const collectionRef = db.collection(
    `users/${userId}/reviews/${reviewId}/reviews`
  );
  const chunkSize = 500;

  await Promise.all(
    allElements.reduce((batches, _, i) => {
      if (i % chunkSize === 0) {
        const chunk = allElements.slice(i, i + chunkSize);
        const batch = db.batch();

        chunk.forEach((doc) => {
          if (doc?.id) batch.set(collectionRef.doc(doc.id), doc);
        });

        batches.push(batch.commit());
      }
      return batches;
    }, [])
  );
}

async function complete(allElements, { limit, reviewId, userId }) {
  const { csvUrl, jsonUrl } = await uploadReviewsAsFile(allElements, {
    reviewId,
  });
  let totalReviews = allElements.length;
  allElements = allElements.slice(0, limit);
  await addReviews(allElements, { userId, reviewId });
  await db.doc(`users/${userId}/reviews/${reviewId}`).update({
    updatedAt: +new Date(),
    completedAt: +new Date(),
    csvUrl,
    jsonUrl,
    totalReviews: allElements.length,
    totalReviewsScraped: totalReviews,
  });
  console.log("Review completed");
}

module.exports = {
  sortReviews,
  getInitialReviews,
  watchReviews,
};
