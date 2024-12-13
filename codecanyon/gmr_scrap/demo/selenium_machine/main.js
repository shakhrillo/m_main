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
  const getExtractedValues = await getScriptContent(
    "getExtractedValues.js",
    "scripts"
  );
  const getReviewIds = getScriptContent("getReviewIds.js", "scripts");
  const scrollToLoader = getScriptContent("scrollToLoader.js", "scripts");
  const scrollToContainer = getScriptContent("scrollToContainer.js", "scripts");

  let allElements = [];
  let extractedImages = [];
  let extractedOwnerReviewCount = 0;
  let extractedUserReviewCount = 0;

  let stopInterval = false;
  let extracted = 0;
  let reTries = 0;

  const data = await getMachineData(tag);
  const driver = await getDriver();

  // ----------------- Start the process -----------------
  await driver.get(data.url);
  await driver.sleep(2000);

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
  let reviewIds = [];
  let retryCount = 0;

  while (reviewIds.length === 0 && retryCount < 10) {
    reviewIds = await driver.executeScript(getReviewIds);
    await driver.executeScript(scrollToLoader);
    await driver.sleep(1000);
    await driver.executeScript(scrollToContainer);
    retryCount++;
  }

  if (reviewIds.length === 0) {
    console.log("No reviews found");
    driver.quit();
    return;
  }

  console.log("Initial reviewIds:", reviewIds);
  await driver.sleep(5000);

  await driver.executeScript(scrollToLoader);
  const screenshot = await driver.takeScreenshot();
  const screenshotBuffer = Buffer.from(screenshot, "base64");
  const uniqueId = new Date().getTime();
  const _screenshot = await uploadFile(
    screenshotBuffer,
    `${data.userId}/${uniqueId}/screenshot.png`
  );
  await updateMachineData(tag, {
    screenshot: _screenshot,
  });

  // ----------------- Watch the reviews -----------------
  await driver.executeScript(extracterString);

  await driver.sleep(2000);

  async function fetchIds() {
    try {
      const extractedValues = await driver.executeScript(getExtractedValues);
      allElements = extractedValues.allElements;
      extractedImages = extractedValues.extractedImages;
      extractedOwnerReviewCount = extractedValues.extractedOwnerReviewCount;
      extractedUserReviewCount = extractedValues.extractedUserReviewCount;

      console.log("Total reviews:", allElements.length);

      const logs = await driver.manage().logs().get("browser");
      console.lg("Logs:", logs.length);
      logs.forEach((log) => console.log(log));

      if (extracted === allElements.length && reTries >= 20) {
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
        const screenshot = await driver.takeScreenshot();
        const screenshotBuffer = Buffer.from(screenshot, "base64");
        const uniqueId = new Date().getTime();
        const _screenshot = await uploadFile(
          screenshotBuffer,
          `${data.userId}/${uniqueId}/screenshot.png`
        );

        await updateMachineData(tag, {
          screenshot: _screenshot,
        });
        await driver.sleep(1000);
        await driver.executeScript(scrollToContainer);
        await driver.sleep(1000);
        reTries++;
      } else {
        reTries = 0;
      }

      extracted = allElements.length;

      await updateMachineData(tag, {
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
      if (!stopInterval) {
        setTimeout(fetchIds, 5000);
      }
    }
  }

  fetchIds();

  // ----------------- Scroll to the loader -----------------
  await driver.executeScript(scrollToLoader);

  // ----------------- Complete -----------------
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

    updateMachineData(tag, {
      csvUrl,
      jsonUrl,
      totalReviews: allElements.length,
      totalReviewsScraped: totalReviews,
      totalImages: extractedImages.length,
      totalOwnerReviews: extractedOwnerReviewCount,
      totalUserReviews: extractedUserReviewCount,
    });

    console.log("Review completed");
  }
}
try {
  init();
} catch (error) {
  console.error("Error in main.js", error);
}
