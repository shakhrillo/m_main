require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");

async function scrap() {
  const tag = process.env.TAG;
  const machine = await firestore.doc(`machines/${tag}`).get();

  if (!machine.exists) {
    console.error("Machine not found");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return;
  }

  const { url, userId, reviewId } = machine.data();

  const scrapePageData = async (page) => {
    return page.evaluate(() => {
      const stringToNumber = (str) => {
        if (!str) return 0;
        return parseInt(str.replace(/[^0-9,]/g, "").replace(/,/g, ""), 10);
      };

      const getData = (selector, attr = "innerText") =>
        document.querySelector(selector)?.[attr]?.replace(/Address: /, "");

      return {
        title: getData("h1"),
        address: getData("button[data-item-id='address']", "ariaLabel"),
        reviews: stringToNumber(
          getData(`button[jsaction*="reviewChart.moreReviews"]`)
        ),
        rating: parseFloat(
          getData(`[role="img"][aria-label*="stars"]`, "ariaLabel")
        ),
      };
    });
  };

  const cleanPage = async (page) => {
    await page.evaluate(async () => {
      const hideElements = (selectors) =>
        selectors.forEach((s) =>
          document.querySelectorAll(s).forEach((el) => {
            if (s.includes("widget-minimap-icon-overlay")) {
              el.parentElement.style.display = "none";
            } else {
              el.style.display = "none";
            }
          })
        );

      const selectors = [
        `button[aria-labelledby="widget-minimap-icon-overlay"]`,
        `button[jsaction*="minimap.main"]`,
        `.app-vertical-widget-holder`,
        `a[aria-label="Sign in"]`,
        `.app-horizontal-widget-holder`,
        `a[title="Google apps"]`,
        `button[aria-label*="Expand side panel"]`,
        `.scene-footer`,
        '[role="button"]',
      ];
      document.querySelector(`button[jsaction*="drawer.close"]`).click();
      document.querySelector(`button[jsaction*="zoom.onZoomOutClick"]`).click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      hideElements(selectors);
    });
  };

  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  const data = await scrapePageData(page);
  await cleanPage(page);
  const screenshot = await page.screenshot({ fullPage: true });
  const uniqueId = new Date().getTime();
  data.screenshot = await uploadFile(
    screenshot,
    `${userId}/${uniqueId}/screenshot.png`
  );

  await page.close();
  await browser.close();
  firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
}

try {
  scrap();
} catch (error) {
  console.error(error);
}
