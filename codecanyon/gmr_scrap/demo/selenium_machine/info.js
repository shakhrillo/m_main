const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

async function getMachineData() {
  const snapshot = await firestore.doc(`machines/${tag}`).get();
  const data = snapshot.data();

  return data;
}

(async function init() {
  let data = await getMachineData();
  const { url, userId, reviewId } = data;

  let options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--aggressive-cache-discard");
  options.addArguments("--disable-cache");
  options.addArguments("--disable-application-cache");
  options.addArguments("--disable-offline-load-stale-cache");
  options.addArguments("--disk-cache-size=0");
  options.addArguments("--disable-gpu");
  options.addArguments("--dns-prefetch-disable");
  options.addArguments("--no-proxy-server");
  options.addArguments("--log-level=3");
  options.addArguments("--silent");
  options.addArguments("--disable-browser-side-navigation");
  options.setProxy(null); // Disable proxy
  options.setLoggingPrefs({ browser: "ALL" }); // Log everything

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  driver.manage().setTimeouts({
    implicit: 60000,
    pageLoad: 60000,
    script: 60000,
  });

  const isDriverActive = async (driver) => {
    try {
      await driver.getTitle();
      return true;
    } catch (error) {
      return false;
    }
  };

  async function quitDriver() {
    if (isDriverActive(driver)) {
      await driver.quit();
    }
  }

  async function getElementBySelector(selector) {
    const [element] = await driver.findElements(By.css(selector));
    return element || null;
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
    const reviewsText =
      (await moreReviewsElement.getAttribute("innerText")) || "0";
    return parseInt(reviewsText.replace(/[^0-9,]/g, "").replace(/,/g, ""), 10);
  }

  async function getRating() {
    const ratingElement = await getElementBySelector(
      "[role='img'][aria-label*='stars']"
    );
    if (!ratingElement) return 0;
    return parseFloat(await ratingElement.getAttribute("aria-label")) || 0;
  }

  try {
    // -----------------
    // Start scraping
    // ----------------
    await driver.get(url);
    await driver.sleep(400); // Wait url changes
    let currentUrl = await driver.getCurrentUrl();
    await driver.wait(until.urlContains(currentUrl), 10000); // Wait for the page to load

    // -----------------
    // Get data
    // -----------------
    data.title = await driver.getTitle();
    data.address = await getAddress();
    data.reviews = await getReviews();
    data.rating = await getRating();

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
    console.error("Error:", err);
  } finally {
    await firestore
      .doc(`users/${userId}/reviewOverview/${reviewId}`)
      .update(data);
    await quitDriver();
  }
})();
