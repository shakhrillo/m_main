require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const tag = process.env.TAG;

async function getMachineData() {
  if (!tag) {
    console.error("Tag not found");
    return;
  }
  const machine = await firestore.doc(`machines/${tag}`).get();
  if (!machine.exists) {
    console.error("Machine not found");
    return;
  }

  return machine.data();
}

async function scrap() {
  let data = await getMachineData();
  if (!data) return;

  const { url, userId, reviewId } = data;

  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  console.log("Page loaded");

  await page.evaluate(async () => {
    const buttons = document.querySelectorAll(
      "button[aria-label='Collapse side panel']"
    );
    buttons.forEach((button) => button.click());
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  });

  data = await page.evaluate(() => {
    const stringToNumber = (str) =>
      parseInt(str?.replace(/[^0-9,]/g, "").replace(/,/g, ""), 10) || 0;

    const getData = (selector, attr = "innerText") => {
      const element = document.querySelector(selector);
      return element?.[attr]?.replace(/Address: /, "") || "";
    };

    return {
      title: getData("h1"),
      address: getData("button[data-item-id='address']", "ariaLabel"),
      reviews: stringToNumber(
        getData(`button[jsaction*="reviewChart.moreReviews"]`)
      ),
      rating:
        parseFloat(getData(`[role="img"][aria-label*="stars"]`, "ariaLabel")) ||
        0,
    };
  });

  await page.evaluate(() => {
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

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (selector.includes("widget-minimap-icon-overlay")) {
          element = element.parentElement;
        }

        if (element) {
          element.remove();
        }
      });
    });
  });

  console.log(`data`, data);

  const screenshot = await page.screenshot({ fullPage: true });
  const uniqueId = new Date().getTime();
  data.screenshot = await uploadFile(
    screenshot,
    `${userId}/${uniqueId}/screenshot.png`
  );

  await page.close();
  await browser.close();
  console.log("Data scraped", data);
  firestore.doc(`users/${userId}/reviewOverview/${reviewId}`).update(data);
}

try {
  scrap();
} catch (error) {
  console.error(error);
}
