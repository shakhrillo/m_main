require("dotenv").config();
const { By } = require("selenium-webdriver");
const { getMachineData } = require("./services/firebase");

const { getDriver } = require("./services/selenium");
const { getScriptContent } = require("./services/scripts");
const { quitDriver, isDriverActive } = require("./services/selenium");
const {
  uploadFile,
  batchWriteLargeArray,
  updateMachineData,
} = require("./services/firebase");

const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

async function init() {
  const extracterString = await getScriptContent("extracter.js", "helper");
  const getReviewIds = getScriptContent("getReviewIds.js", "scripts");
  const scrollToLoader = getScriptContent("scrollToLoader.js", "scripts");
  const scrollToContainer = getScriptContent("scrollToContainer.js", "scripts");

  const data = await getMachineData(tag);
  const driver = await getDriver();

  // ----------------- Start the process -----------------
  await driver.get(data.url);
  console.log("URL:", data.url);
  await driver.sleep(2000);

  // ----------------- Set config -----------------
  await driver.executeScript(
    `window.gmrScrap = ${JSON.stringify(data, null, 2)}`
  );

  // ----------------- Click on the reviews tab -----------------
  const reviewsTabs =
    (await driver.findElements(By.css('button[role="tab"]'))) || [];
  for (const tab of reviewsTabs) {
    const tabText = await tab.getText();
    if (tabText.toLowerCase().includes("reviews")) {
      tab.click();
      break;
    }
  }
  await driver.sleep(2000);

  // ----------------- Sort the reviews -----------------
  const sortButton = await driver.findElement(
    By.css(
      'button[aria-label="Sort reviews"], button[aria-label="Most relevant"]'
    )
  );
  if (sortButton) {
    await sortButton.click();
    await driver.sleep(400);

    const menuItems = await driver.findElements(
      By.css('[role="menuitemradio"]')
    );
    for (const item of menuItems) {
      const text = await item.getText();

      if (text === data.sortBy) {
        await item.click();
        console.log("Sorting by:", data.sortBy);
        break;
      }
    }
  }
  await driver.sleep(2000);

  // ----------------- Wait for the reviews to load -----------------
  let extractedReviewIds = (await driver.executeScript(getReviewIds)) || [];
  let retries = 0;

  console.log("Initial review ids", extractedReviewIds.length);
  while (extractedReviewIds.length === 0 && retries < 10) {
    try {
      console.log("Retrying to fetch review IDs...");
      extractedReviewIds = await driver.executeScript(getReviewIds);
      await driver.executeScript(scrollToLoader);
      await driver.sleep(2000);
      await driver.executeScript(scrollToContainer);
    } catch (error) {
      console.error("Error in while loop", error);
    } finally {
      retries++;
    }
  }
  console.log("Scrolledintials", extractedReviewIds.length);

  if (extractedReviewIds.length === 0) {
    console.log("No review IDs found. Exiting...");
    driver.quit();
    return;
  }

  // ----------------- Watch the reviews -----------------
  await driver.executeScript(extracterString);

  const extractedReviews = [];
  let retriesCount = 0;

  while (extractedReviews.length < data.limit && retriesCount < 20) {
    let startedTime = Date.now();
    try {
      let visibleElements = await driver.executeScript(
        `return fetchVisibleElements()`
      );
      await driver.sleep(400);
      console.log("Visible elements:", visibleElements.length);

      if (visibleElements.length === 0) {
        retriesCount++;
        visibleElements = await driver.executeScript(
          `return fetchVisibleElements()`
        );
      } else {
        retriesCount = 0;
      }

      if (retriesCount > 20) {
        console.log("Retries exceeded. Exiting...");
        break;
      }

      extractedReviews.push(...visibleElements);

      await updateMachineData(tag, {
        totalReviews: extractedReviews.length,
      });

      if (extractedReviews.length >= data.limit) {
        break;
      }
    } catch (error) {
      retriesCount++;
      console.error("Error in while loop");
    } finally {
      console.log(
        `Elapsed time: (${Math.round(
          (Date.now() - startedTime) / 1000
        )} seconds)`
      );
      console.log("Retries:", retriesCount);
      console.log("Total reviews:", extractedReviews.length);
      console.log("-".repeat(20));
    }
  }

  // ----------------- Complete -----------------
  console.log("-".repeat(20));
  console.log("Completed");
  console.log("-".repeat(20));
  // extractedImages
  const gmrScrap = await driver.executeScript(`return window.gmrScrap`);
  let csvUrl = "";
  let jsonUrl = "";
  if (extractedReviews.length > 0) {
    const jsonContent = JSON.stringify(extractedReviews, null, 2);
    const csvContent = [
      Object.keys(extractedReviews[0]).join(","),
      ...extractedReviews.map((el) => Object.values(el).join(",")),
    ].join("\n");
    csvUrl = await uploadFile(csvContent, `csv/${tag}.csv`);
    jsonUrl = await uploadFile(jsonContent, `json/${tag}.json`);
  }

  let totalReviews = extractedReviews.length;
  // allElements = allElements.slice(0, data.limit);

  await batchWriteLargeArray(
    `users/${data.userId}/reviews/${data.reviewId}/reviews`,
    extractedReviews
  );
  await batchWriteLargeArray(
    `users/${data.userId}/reviews/${data.reviewId}/images`,
    gmrScrap["extractedImages"]
  );

  updateMachineData(tag, {
    csvUrl,
    jsonUrl,
    totalReviews: extractedReviews.length,
    totalReviewsScraped: totalReviews,
    totalImages: gmrScrap["extractedImages"].length,
    totalOwnerReviews: gmrScrap["extractedOwnerReviewCount"],
    totalUserReviews: gmrScrap["extractedUserReviewCount"],
    status: "completed",
  });

  console.log("Review completed");
}
try {
  init();
} catch (error) {
  console.error("Error in main.js", error);
}
