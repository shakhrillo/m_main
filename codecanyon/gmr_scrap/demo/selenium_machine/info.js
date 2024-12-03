const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const tag =
  process.env.TAG || "info_iigecj14ivrk37rmzdsefu1pufat_guiauzsmjqutgip3cqf9";

(async function init() {
  async function getMachineData() {
    console.log("Getting machine data for", tag);
    if (!tag) {
      console.error("Tag not found");
      return;
    }
    try {
      await firestore.doc(`machines/${tag}`).get();
    } catch (error) {
      console.error("Error getting machine data", error);
    }
    const machine = await firestore.doc(`machines/${tag}`).get();
    console.log("Machine data", machine.data());
    if (!machine.exists) {
      console.error("Machine not found");
      return;
    }

    return machine.data();
  }

  let data = await getMachineData();
  const { url, userId, reviewId } = data;
  console.log("Scraping data for", url);

  if (!data) {
    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "error",
      error: "Machine not found",
    });
    return;
  }

  // Create a new instance of the browser driver with headless options
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options().addArguments("--headless=new", "--no-sandbox")
    )
    .build();

  async function getElementBySelector(selector) {
    const elements = await driver.findElements(By.css(selector));
    return elements.length > 0 ? elements[0] : null;
  }

  try {
    console.log("Starting driver");
    console.log("Navigating to", url);
    let startTimestamp = new Date().getTime();
    // Navigate to a website
    await driver.get(url);
    await driver.sleep(2000);
    let currentUrl = await driver.getCurrentUrl();
    console.log("Current URL:", currentUrl);
    await driver.wait(until.urlContains(currentUrl), 10000);
    let spentTimeInSeconds = (new Date().getTime() - startTimestamp) / 1000;
    console.log("Spent time:", spentTimeInSeconds, "seconds");

    // Wait for the page to load and display the title
    const title = await driver.getTitle();
    console.log("Page title:", title);
    data.title = title;

    const addressElement = await getElementBySelector(
      "button[data-item-id='address']"
    );
    if (addressElement) {
      data.address = await addressElement.getAttribute("aria-label");
    }

    const moreReviewsElement = await getElementBySelector(
      "button[jsaction*='reviewChart.moreReviews']"
    );
    if (moreReviewsElement) {
      const reviewsText =
        (await moreReviewsElement.getAttribute("innerText")) || "0";
      data.reviews = parseInt(
        reviewsText.replace(/[^0-9,]/g, "").replace(/,/g, ""),
        10
      );
    }

    const ratingElement = await getElementBySelector(
      "[role='img'][aria-label*='stars']"
    );
    if (ratingElement) {
      data.rating = parseFloat(
        (await ratingElement.getAttribute("aria-label")) || 0
      );
    }

    const minimapElement = await getElementBySelector("#minimap");
    if (minimapElement) {
      await driver.executeScript("arguments[0].remove();", minimapElement);
    }

    const viewcardStripElement = await getElementBySelector(
      ".app-viewcard-strip"
    );
    if (viewcardStripElement) {
      await driver.executeScript(
        "arguments[0].remove();",
        viewcardStripElement
      );
    }

    const sidePanelBtns = await driver.findElements(
      By.css("button[aria-label='Collapse side panel']")
    );
    for (const btn of sidePanelBtns) {
      if (!(await btn.isDisplayed())) {
        continue;
      }
      await btn.click();
    }

    const sidePanel = await getElementBySelector(
      "button[jsaction*='drawer.open']"
    );
    if (sidePanel) {
      await driver.executeScript("arguments[0].remove();", sidePanel);
    }

    const googleBar = await getElementBySelector("#gb");
    if (googleBar) {
      await driver.executeScript("arguments[0].remove();", googleBar);
    }

    // .scene-footer-container
    const sceneFooter = await getElementBySelector(".scene-footer-container");
    if (sceneFooter) {
      await driver.executeScript("arguments[0].remove();", sceneFooter);
    }

    await driver.sleep(2000);

    const screenshot = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshot, "base64");
    console.log("Screenshot taken");
    console.log(`screenshotBuffer: ${screenshotBuffer.length} bytes`);

    const uniqueId = new Date().getTime();
    data.screenshot = await uploadFile(
      screenshotBuffer,
      `${userId}/${uniqueId}/screenshot.png`
    );

    firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update({
      status: "completed",
      ...data,
    });

    console.log("Data:", data);
  } finally {
    // Quit the driver
    await driver.quit();
  }
})();
