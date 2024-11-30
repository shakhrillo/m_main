require("dotenv").config();
const { launchBrowser, openPage } = require("./services/browser");
const { firestore } = require("./services/firebase");
const { uploadFile } = require("./services/storage");
const { Subject } = require("rxjs");

// const { URL: url, USER_ID: userId, REVIEW_ID: reviewId } = process.env;

async function scrap() {
  const tag = process.env.TAG;
  console.log("TAG", tag);
  const machine = await firestore.doc(`machines/${tag}`).get();

  if (!machine.exists) {
    console.error("Machine not found");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return;
  }

  console.log("Machine", machine.data());

  const { url, userId, reviewId } = machine.data();

  const firestorePath = `users/${userId}/reviewOverview/${reviewId}`;

  const updateFirestore = (collection, data) =>
    firestore.collection(collection).doc(reviewId).update(data);

  const addStatus = (status, message) =>
    firestore
      .collection(`${firestorePath}/status`)
      .add({ status, createdAt: new Date(), message });

  const messages$ = new Subject();
  messages$.subscribe((msg) => {
    console.log(msg);
    addStatus("info", msg);
  });

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
      hideElements(selectors);

      document.querySelector(`button[jsaction*="drawer.close"]`)?.click();
      document
        .querySelector(`button[jsaction*="zoom.onZoomOutClick"]`)
        ?.click();
    });
  };

  async function init() {
    try {
      messages$.next("Starting process");
      await updateFirestore(`users/${userId}/reviewOverview`, {
        createdAt: new Date(),
        pending: true,
        url,
        userId,
        reviewId,
      });
      messages$.next("Updated firestore");

      const browser = await launchBrowser();
      messages$.next("Browser launched");
      const page = await openPage(browser, url);
      messages$.next("Page opened");

      const data = await scrapePageData(page);
      messages$.next("Extracted data");

      messages$.next("Cleaning page");
      await cleanPage(page);

      const screenshot = await page.screenshot({ fullPage: true });
      const uniqueId = url.split("/").pop();
      data.screenshot = await uploadFile(
        screenshot,
        `${userId}/${uniqueId}/screenshot.png`
      );
      messages$.next("Screenshot uploaded");

      await page.close();
      await browser.close();
      await updateFirestore(`users/${userId}/reviewOverview`, {
        createdAt: new Date(),
        pending: false,
        ...data,
      });
    } catch (error) {
      console.error(error);
      messages$.next(error.message);
    }
  }

  init();
}

scrap();
