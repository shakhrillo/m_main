require("dotenv").config();
const { By } = require("selenium-webdriver");
const {
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

async function init() {
  console.log("Tag:", tag);
  const data = await getMachineData(tag);
  const driver = await getDriver({
    timeouts: {
      implicit: 45000,
      pageLoad: 45000,
      script: 5000,
    },
  });
  console.log("Data:", data);

  // -----------------
  // Start scraping
  // ----------------
  await driver.get(data.url);
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
    data.screenshot = await uploadFile(
      screenshotBuffer,
      `${tag}/screenshot.png`
    );
  } catch (err) {
    await updateMachineData(tag, { error: JSON.stringify(err) });
    console.error("Error:", err);
  } finally {
    console.log("Data:", data);
    await updateMachineData(tag, data);
    await driver.quit();
  }
}

init();
