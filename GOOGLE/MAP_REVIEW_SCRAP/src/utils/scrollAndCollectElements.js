const wait = require("./wait");
const getReviewElements = require("./getReviewElements");
const getReviewsContainer = require("./getReviewsContainer");
const logger = require("../config/logger");
const waitForReviewData = require("./waitForReviewData");
// const puppeteerMutationListener = require("./puppeteerMutationListener");
const fetchReviewDetails = require("./fetchReviewDetails");

/**
 * Scrolls to the bottom of the reviews container.
 *
 * @param {Page} page - The Puppeteer page object representing the current web page.
 */
async function scrollToBottom(page) {
  await page.evaluate(() => {
    const reviewsContainer = document.querySelector(".vyucnb")?.parentElement;
    if (reviewsContainer?.lastChild) {
      reviewsContainer.lastChild.scrollIntoView();
    }
  });
}

/**
 * Observes the reviews container for new reviews being added.
 *
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} uid - The user ID for tracking purposes.
 * @param {string} pushId - The push notification ID for updates.
 */
async function setupReviewObserver(page) {
  await page.evaluate(() => {
    const logNewNodes = (records) => {
      records.forEach((record) => {
        if (record.type === "childList") {
          const addedNodes = Array.from(record.addedNodes);
          const addedNodeIds = addedNodes
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);

          // Custom handler for added nodes
          window.puppeteerMutationListener(addedNodeIds);
        }
      });
    };

    const observer = new MutationObserver(logNewNodes);
    const parentEl = document.querySelector(".vyucnb").parentElement;
    observer.observe(parentEl.children[parentEl.children.length - 2], {
      childList: true,
    });
  });
}

/**
 * Scrolls through a page and collects review elements up to a specified limit.
 *
 * @param {Page} page - The Puppeteer page object representing the current web page.
 * @param {string} uid - The user ID for tracking purposes.
 * @param {string} pushId - The push notification ID for updates.
 * @param {number} [limit=50] - The maximum number of review elements to collect.
 * @returns {Promise<Array>} - A promise that resolves to an array of collected review elements.
 */
async function scrollAndCollectElements(page, uid, pushId, limit = 50) {
  logger.info("Scrolling and collecting review elements");
  const reviewsContainer = await getReviewsContainer(page);
  if (!reviewsContainer) {
    logger.error("No reviews container found");
    return [];
  }

  await wait(3000);

  await page.evaluate(async () => {
    let lastLogTime = Date.now();

    const observerCallback = async (records) => {
      for (const record of records) {
        if (record.type === "childList") {
          const addedNodeIds = Array.from(record.addedNodes)
            .map((node) => node.getAttribute("data-review-id"))
            .filter(Boolean);
          await puppeteerMutationListener(addedNodeIds);
        }
      }
      lastLogTime = Date.now();
    };

    const logInterval = setInterval(() => {
      if (Date.now() - lastLogTime > 5000) {
        console.log("No new reviews added in the last 5 seconds");
        document
          .querySelector(".vyucnb")
          .parentElement.lastChild.scrollIntoView();
      }
    }, 5000);

    const parentEl = document.querySelector(".vyucnb").parentElement;
    console.log("child", parentEl.children[parentEl.children.length - 2]);
    new MutationObserver(observerCallback).observe(
      parentEl.children[parentEl.children.length - 2],
      {
        childList: true,
      }
    );
  });

  // await setupReviewObserver(page);
  // logger.info("Review observer set up");

  const visibleElements = await waitForReviewData(page, reviewsContainer);
  logger.info("Review data is ready");

  await scrollToBottom(page);
  logger.info("Scrolled to the bottom");

  let allElements = [];
  for (const record of visibleElements) {
    const element = await fetchReviewDetails(page, record);
    allElements.push(element);
  }
  logger.info(`Fetched details for ${allElements.length} reviews`);

  return allElements;
}

module.exports = { scrollAndCollectElements };
