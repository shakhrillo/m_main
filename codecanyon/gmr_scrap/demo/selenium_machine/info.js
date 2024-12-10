require("dotenv").config();
const {
  Builder,
  By,
  until,
  WebDriver,
  Browser,
} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { db, uploadFile } = require("./services/firebase");

const tag = process.env.TAG;

if (!tag) {
  console.error("Tag not found");
  return;
}

let options = new chrome.Options();
options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
// options.addArguments("--window-size=1920,1080");
options.setLoggingPrefs({ browser: "ALL" });
// chromium
options.setChromeBinaryPath("/usr/bin/chromium");
options.excludeSwitches("enable-automation");

new Builder()
  .forBrowser(Browser.CHROME)
  .setChromeOptions(options)
  .build()
  .then(async (driver) => {
    console.log("Driver started", driver);

    driver.manage().setTimeouts({
      implicit: 3000,
      pageLoad: 180000,
      script: 180000,
    });

    async function getMachineData() {
      const snapshot = await db.doc(`machines/${tag}`).get();
      const data = snapshot.data();

      return data;
    }

    let data = await getMachineData();
    let { url, userId, reviewId } = data;

    console.log("Starting driver");

    // -----------------
    // Start scraping
    // ----------------
    const start = new Date().getTime();
    console.log("Starting scraping");
    await driver.get(url);
    await driver.sleep(5000);
    const end = new Date().getTime();
    const spentInSec = (end - start) / 1000;
    console.log("Time spent:", spentInSec);

    try {
      const isDriverActive = async () => {
        try {
          await driver.getTitle();
          return true;
        } catch (error) {
          return false;
        }
      };

      async function quitDriver() {
        if (isDriverActive()) {
          await driver.quit();
        }
      }

      async function getElementBySelector(selector) {
        console.info("Finding element by selector:", selector);
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

      const session = await driver.getSession();
      console.log("Session ID:", session.toJSON());

      // -----------------
      // Get data
      // -----------------
      data.title = await driver.getTitle();
      console.log("Title:", data.title);
      data.address = (await getAddress()) || "";
      console.log("Address:", data.address);
      data.reviews = (await getReviews()) || 0;
      console.log("Reviews:", data.reviews);
      data.rating = (await getRating()) || 0;
      console.log("Rating:", data.rating);

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
      await db.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
      await driver.quit();
    }
  })
  .catch((err) => {
    console.log("error>>>");
    console.error("Error:", err);
  });
