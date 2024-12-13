require("dotenv").config();
const { Builder, By, Browser } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {
  db,
  uploadFile,
  getMachineData,
  updateMachineData,
} = require("./services/firebase");
const { getDriver } = require("./services/selenium");

const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

getDriver()
  .then(async (driver) => {
    const data = await getMachineData(tag);
    const { url, userId, reviewId } = data;

    // -----------------
    // Start scraping
    // ----------------
    await driver.get(url);
    await driver.sleep(2000);

    try {
      async function getElementBySelector(selector) {
        const elements = await driver.findElements(By.css(selector));
        if (elements.length === 0) return null;
        return elements[0];
      }

      async function getAddress() {
        const addressElement = await getElementBySelector(
          "button[data-item-id='address']"
        );

        if (!addressElement) return;
        return await addressElement.getAttribute("aria-label");
      }

      async function getReviews() {
        const moreReviewsElement = await getElementBySelector(
          "button[jsaction*='reviewChart.moreReviews']"
        );
        if (!moreReviewsElement) return 0;
        await driver.executeScript(
          "arguments[0].scrollIntoView();",
          moreReviewsElement
        );
        const reviewsText =
          (await moreReviewsElement.getAttribute("innerText")) || "0";
        return parseInt(
          reviewsText.replace(/[^0-9,]/g, "").replace(/,/g, ""),
          10
        );
      }

      async function getRating() {
        const ratingElement = await getElementBySelector(".fontDisplayLarge");
        if (!ratingElement) return 0;
        return parseFloat(await ratingElement.getAttribute("innerText")) || 0;
      }

      // -----------------
      // Get data
      // -----------------
      data.title = await driver.getTitle();
      data.address = (await getAddress()) || "";
      data.reviews = (await getReviews()) || 0;
      data.rating = (await getRating()) || 0;

      // -----------------
      // Prepare for screenshot
      // -----------------
      const minimapElement = await getElementBySelector("#minimap");
      if (minimapElement) {
        await driver.executeScript("arguments[0].remove();", minimapElement); // Remove basemap layer
      }

      const viewcardStripElement = await getElementBySelector(
        ".app-viewcard-strip"
      );
      if (viewcardStripElement) {
        await driver.executeScript(
          "arguments[0].remove();",
          viewcardStripElement
        ); //Remove bottom toolbar
      }

      const sidePanelBtns = await driver.findElements(
        By.css("button[aria-label='Collapse side panel']")
      );
      for (const btn of sidePanelBtns) {
        if (!(await btn.isDisplayed())) {
          continue;
        }
        await btn.click(); // Collapse side panel
      }

      const sidePanel = await getElementBySelector(
        "button[jsaction*='drawer.open']"
      );
      if (sidePanel) {
        await driver.executeScript("arguments[0].remove();", sidePanel); // Remove side panel expand button
      }

      const googleBar = await getElementBySelector("#gb");
      if (googleBar) {
        await driver.executeScript("arguments[0].remove();", googleBar); // Remove google bar
      }

      const sceneFooter = await getElementBySelector(".scene-footer-container");
      if (sceneFooter) {
        await driver.executeScript("arguments[0].remove();", sceneFooter); // Remove scene footer
      }

      await driver.sleep(2000);

      // -----------------
      // Take screenshot
      // -----------------
      const screenshot = await driver.takeScreenshot();
      const screenshotBuffer = Buffer.from(screenshot, "base64");
      const uniqueId = new Date().getTime();
      data.screenshot = await uploadFile(
        screenshotBuffer,
        `${userId}/${uniqueId}/screenshot.png`
      );
    } catch (err) {
      await updateMachineData(tag, { error: JSON.stringify(err) });
      console.error("Error:", err);
    } finally {
      await updateMachineData(tag, data);
      // await db.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
      await driver.quit();
    }
  })
  .catch((err) => {
    console.error("Error:", err);
  });
