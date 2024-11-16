const wait = require("./wait");
const { updateReview } = require("../controllers/reviewController");
const checkInfiniteScroll = require("./checkInfiniteScroll");
const getReviewElements = require("./getReviewElements");
const getReviewsContainer = require("./getReviewsContainer");
const filterUniqueElements = require("./filter");
const logger = require("../config/logger");
const waitForReviewData = require("./waitForReviewData");
// require('mutationobserver-shim');

/**
 * Scrolls through a page to collect review elements up to a specified limit.
 *
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} uid - The user ID for tracking purposes.
 * @param {string} pushId - The push notification ID for updates.
 * @param {number} [limit=50] - The maximum number of review elements to collect.
 * @returns {Promise<Array>} - A promise that resolves to an array of collected review elements.
 */
async function scrollTopAndBottom(page) {
  await page.evaluate(async () => {
    const el = document.querySelector(".vyucnb");
    const reviewsContainer = el.parentElement;
    const lastChild = reviewsContainer.lastChild;

    lastChild.scrollIntoView();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
}

async function scrollAndCollectElements(page, uid, pushId, limit) {
  const reviewsContainer = await getReviewsContainer(page);
  let allElements = [];

  if (!reviewsContainer) {
    logger.error("No reviews container found");
    return [];
  }

  logger.info("Reviews container found");
  await waitForReviewData(page);
  logger.info("Review data is ready");
  await scrollTopAndBottom(page);
  logger.info("Scrolled to the bottom");

  await wait(3000);

  await page.evaluate(async () => {
    let lastLogTime = Date.now();

    setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastLogTime > 5000) {
        console.log("No new reviews added in the last 5 seconds");

        const el = document.querySelector(".vyucnb");
        const reviewsContainer = el.parentElement;
        const lastChild = reviewsContainer.lastChild;
        lastChild.scrollIntoView();
      }
    }, 5000);

    async function logNewNodes(records) {
      for (const record of records) {
        if (record.type === "childList") {
          const addedNodes = Array.from(record.addedNodes);
          const addedNodeIds = addedNodes
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);
          await puppeteerMutationListener(addedNodeIds, uid, pushId);
        }
      }

      const currentTime = Date.now();
      lastLogTime = currentTime;
    }

    const observer = new MutationObserver(logNewNodes);
    const parentEl = document.querySelector(".vyucnb").parentElement;
    observer.observe(parentEl.children[parentEl.children.length - 2], {
      childList: true,
    });
  });

  return allElements;
}

exports.scrollAndCollectElements = scrollAndCollectElements;
