const { launchBrowser, openPage } = require("../services/browserService");
const wait = require("../utils/wait");
const logger = require("../config/logger");
const clickReviewTab = require("../utils/clickReviewTab");
const sortReviews = require("../utils/sortReviews");
const {
  scrollAndCollectElements,
} = require("../utils/scrollAndCollectElements");
const fetchReviewDetails = require("../utils/fetchReviewDetails");
const waitForArrayGrowth = require("../utils/waitForArrayGrowth");
const {
  addComments,
  updateReview,
  batchWriteLargeArray,
} = require("./reviewController");

const browser = {};
const page = {};
const elements = {};
let limitIsReached = {};

async function scrapePageComments(
  { url, userId, reviewId, limit, sortBy },
  port,
  containerName
) {
  browser[containerName] = await launchBrowser(port);
  page[containerName] = await openPage(browser[containerName], url);
  elements[containerName] = [];
  limitIsReached[containerName] = false;

  // await page[containerName].setCacheEnabled(false);

  // page[containerName].on("close", () => {
  //   logger.error("Page closed unexpectedly");
  //   limitIsReached[containerName] = true;
  // });

  page[containerName].on("error", (error) => {
    console.error("Page error:", error);
    limitIsReached[containerName] = true;
  });
  // page[containerName].on("pageerror", (error) =>
  //   console.error("Uncaught error:", error)
  // );

  page[containerName].exposeFunction("logger", async function log(message) {
    console.log(message);
  });

  page[containerName].exposeFunction(
    "puppeteerMutationListener",
    async function puppeteerMutationListener(records, uid, reviewId) {
      console.log("Record:", records.length);
      console.log("Saved:", elements[containerName].length);

      if (limitIsReached[containerName]) {
        return;
      }

      for (const record of records) {
        await fetchReviewDetails(page[containerName], record)
          .then(async (result) => {
            if (result) {
              elements[containerName].push(result);
            }
          })
          .catch((error) => {
            console.error("Error fetching review details:", error);
          });
      }
    }
  );

  await page[containerName].evaluate(
    ({ uid, reviewId }) => {
      window.uid = uid;
      window.reviewId = reviewId;
    },
    { uid: userId, reviewId: reviewId }
  );

  logger.info(`Pushing to ${reviewId} page`);

  const title = await page[containerName].title();

  await updateReview(userId, reviewId, {
    status: "in_progress",
    createdAt: new Date(),
    title,
  });

  await clickReviewTab(page[containerName]);
  await wait(2000);
  await sortReviews(page[containerName], sortBy);
  await wait(2000);

  // const currentUrl = page[containerName].url();
  // page[containerName].on("framenavigated", async (frame) => {
  //   console.log("Frame navigated", frame.url());
  //   if (
  //     frame === page[containerName].mainFrame() &&
  //     frame.url() !== currentUrl
  //   ) {
  //     logger.error(`Navigated to URL: ${currentUrl}`);
  //     // await frame.goto(currentUrl, {
  //     //   // ...config.goto,
  //     //   timeout: 30000,
  //     // });
  //     // await wait(2000);
  //     // go back to the previous page
  //     // check if there is history
  //     // await page[containerName].goBack();
  //   }
  // });

  // Disable opening new tabs/windows
  // await page[containerName].evaluateOnNewDocument(() => {
  //   window.open = () => {
  //     console.warn("Prevented a new tab from opening.");
  //     return null;
  //   };
  // });

  // page[containerName].on("popup", async (popup) => {
  //   console.log("Popup prevented and closed:", await popup.url());
  //   await popup.close();
  // });

  // await page[containerName].goto("https://example.com");

  // const initialElements = await scrollAndCollectElements(
  //   page[containerName],
  //   userId,
  //   reviewId,
  //   limit
  // );
  // elements[containerName].push(...initialElements);

  page[containerName].evaluate(() => {
    let lastLogTime = Date.now();
    // let lastNodeId = null;

    const observerCallback = (records) => {
      for (const record of records) {
        if (record.type === "childList") {
          const addedNodeIds = Array.from(record.addedNodes)
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);
          puppeteerMutationListener(addedNodeIds, window.uid, window.pushId);
          // lastNodeId = addedNodeIds[addedNodeIds.length - 1];
        }
      }
      lastLogTime = Date.now();
    };

    // setInterval(() => {
    //   try {
    //     log(`Last log time: ${lastLogTime}`);
    //     if (Date.now() - lastLogTime > 5000) {
    //       log("No new records in the last 5 seconds. Stopping...");
    //       const vyuCnb = document.querySelector(".vyucnb");
    //       if (!vyuCnb) {
    //         log("No .vyucnb element found");
    //       } else {
    //         log(
    //           document.querySelector(".vyucnb").parentElement.firstElementChild
    //         );
    //         if (lastNodeId) {
    //           document
    //             .querySelector(`[data-review-id="${lastNodeId}"]`)
    //             .scrollIntoView();
    //         }
    //         setTimeout(() => {
    //           document
    //             .querySelector(".vyucnb")
    //             .parentElement.lastChild.scrollIntoView();
    //         }, 2000);
    //       }
    //     }
    //   } catch (error) {
    //     log("Error scrolling to the top of the page", error);
    //   }
    // }, 5000);

    const parentEl = document.querySelector(".vyucnb").parentElement;
    new MutationObserver(observerCallback).observe(
      parentEl.children[parentEl.children.length - 2],
      {
        childList: true,
      }
    );
  });

  await waitForArrayGrowth(elements[containerName], limit);

  limitIsReached[containerName] = true;

  await updateReview(userId, reviewId, {
    status: "completed",
    completedAt: new Date(),
    totalReviews: elements[containerName].length,
    title,
  });

  batchWriteLargeArray(userId, reviewId, elements[containerName]);
  await wait(1000);

  await page[containerName].close();
  await browser[containerName].close();

  return {
    ...{ url, userId, reviewId, limit, sortBy },
    port,
    containerName,
    title,
    elements: elements[containerName],
  };
}

module.exports = scrapePageComments;
