require("dotenv").config();
const fs = require("fs");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { db, uploadFile } = require("./services/firebase");
const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

async function getMachineData() {
  const snapshot = await db.doc(`machines/${tag}`).get();
  const data = snapshot.data();

  return data;
}

(async function init() {
  let data = await getMachineData();
  let { url, userId, reviewId } = data;
  // url =
  //   "https://www.google.com/maps/place/Alcazaba/@37.1760783,-3.5881413,17z/data=!4m6!3m5!1s0xd71fdb67e1bd027:0x982c56f50f595b46!8m2!3d37.1770392!4d-3.5915999!16s%2Fg%2F121m7k7d?entry=ttu&g_ep=EgoyMDI0MTIwNC4wIKXMDSoASAFQAw%3D%3D";
  console.log("Data:", data);

  let options = new chrome.Options();
  options.addArguments("--headless");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-gpu");
  options.addArguments("--disable-dev-shm-usage");
  // options.addArguments("--disable-dev-shm-usage");
  // options.addArguments("--aggressive-cache-discard");
  // options.addArguments("--disable-cache");
  // options.addArguments("--disable-application-cache");
  // options.addArguments("--disable-offline-load-stale-cache");
  // options.addArguments("--disk-cache-size=0");
  // options.addArguments("--disable-gpu");
  // options.addArguments("--dns-prefetch-disable");
  // options.addArguments("--no-proxy-server");
  // options.addArguments("--log-level=3");
  // options.addArguments("--silent");
  // options.addArguments("--disable-browser-side-navigation");
  // add screen size
  options.addArguments("--window-size=1920,1080");
  options.setProxy(null); // Disable proxy
  options.setLoggingPrefs({ browser: "ALL" }); // Log everything

  console.log("Starting driver");
  console.log(`CHROME_DRIVER_VERSION: ${process.env.CHROME_DRIVER_VERSION}`);

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  driver.manage().setTimeouts({
    implicit: 3000,
    pageLoad: 60000,
    script: 60000,
  });

  try {
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
      const elements = await driver.findElements(By.css(selector));
      if (elements.length === 0) return null;
      return elements[0];
    }

    async function getAddress() {
      const addressElement = await getElementBySelector(
        "button[data-item-id='address']"
      );

      console.log("Address element:", addressElement);

      if (!addressElement) return;
      return await addressElement.getAttribute("aria-label");
    }

    async function getReviews() {
      const ratingElement = await getElementBySelector(".fontDisplayLarge");
      if (!ratingElement) return 0;
      // fontDisplayLarge parent element
      const parentElement = await ratingElement.findElement(By.xpath(".."));
      return parseFloat(await ratingElement.getAttribute("innerText")) || 0;

      const moreReviewsElement = await getElementBySelector(
        "button[jsaction*='reviewChart.moreReviews']"
      );
      if (!moreReviewsElement) return 0;
      await driver.executeScript(
        "arguments[0].scrollIntoView();",
        moreReviewsElement
      );
      console.log("More reviews element:", moreReviewsElement);
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
    // Start scraping
    // ----------------
    const start = new Date().getTime();
    const session = await driver.getSession();
    console.log(session.id_);
    console.log("Starting scraping");
    await driver.get(url);
    console.log("URL:", url);
    // wait for the page to load
    // await driver.wait(until.urlContains("maps/place"), 10000);
    // await driver.sleep(2000);
    const end = new Date().getTime();
    console.log("Current URL:", await driver.getCurrentUrl());
    const spentInSec = (end - start) / 1000;
    console.log("Time spent:", spentInSec);

    try {
      // Take a screenshot and get it as a base64 string
      const localScreenshot = await driver.takeScreenshot();

      // Save the screenshot locally
      fs.writeFileSync("x.png", localScreenshot, "base64");

      console.log("Screenshot saved as screenshot.png");
    } catch (error) {
      console.error("Error while taking or saving the screenshot:", error);
    }

    const reviewsTabs = await driver.findElements(By.css('button[role="tab"]'));
    console.log("Tabs:", reviewsTabs.length);
    for (const tab of reviewsTabs) {
      const tabText = await tab.getText();
      if (tabText.toLowerCase().includes("reviews")) {
        // scroll to the reviews tab
        await driver.executeScript("arguments[0].scrollIntoView();", tab);
        console.log("Scrolling to reviews tab");
        // tab.click();
        break;
      }
    }
    console.log("Clicked on reviews tab");

    // await driver.sleep(2000);

    console.log("done!");
    console.log("driver", driver);

    // -----------------
    // Get data
    // -----------------
    try {
      data.title = await driver.getTitle();
      console.log("Title:", data.title);
      data.address = (await getAddress()) || "";
      console.log("Address:", data.address);
      // data.reviews = (await getReviews()) || 0;
      // console.log("Reviews:", data.reviews);
      data.rating = (await getRating()) || 0;
      console.log("Rating:", data.rating);
    } catch (error) {
      console.error("Error getting data:", error);
    }

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

    // await driver.sleep(2000);

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
    await db.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
    await quitDriver();
  }
})();
