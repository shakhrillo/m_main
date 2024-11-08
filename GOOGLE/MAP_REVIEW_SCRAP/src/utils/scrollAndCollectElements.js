const wait = require('./wait');
const { updateReview } = require('../controllers/reviewController');
const checkInfiniteScroll = require('./checkInfiniteScroll');
const getReviewElements = require('./getReviewElements');
const getReviewsContainer = require('./getReviewsContainer');
const filterUniqueElements = require('./filter');
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
    const el = document.querySelector('.vyucnb');
    const reviewsContainer = el.parentElement;
    const lastChild = reviewsContainer.lastChild;

    lastChild.scrollIntoView();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
}

async function scrollAndCollectElements(page, uid, pushId, limit) {
  const reviewsContainer = await getReviewsContainer(page);
  let isScrollFinished = false;
  let allElements = [];
  let scrollCount = 0;

  if (!reviewsContainer) {
    console.error('Reviews container not found');
    return [];
  }

  await wait(3000);

  await page.evaluate(async () => {
    let lastLogTime = Date.now();

    setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastLogTime > 5000) {
        console.log('No new reviews added in the last 5 seconds');

        const el = document.querySelector('.vyucnb');
        const reviewsContainer = el.parentElement;
        const lastChild = reviewsContainer.lastChild;
        lastChild.scrollIntoView();
      }
    }, 5000);

    async function logNewNodes(records) {
      for (const record of records) {
        if (record.type === "childList") {
          const addedNodes = Array.from(record.addedNodes);
          const addedNodeIds = addedNodes.map(node => node.getAttribute("data-review-id")).filter(Boolean);
          await puppeteerMutationListener(addedNodeIds, uid, pushId);
        }
      }

      const currentTime = Date.now();
      lastLogTime = currentTime;

      // const el = document.querySelector('.vyucnb');
      // const reviewsContainer = el.parentElement;
      // const lastChild = reviewsContainer.lastChild;
      // const lastChildChildren = Array.from(lastChild.children);
      // const nextEl = el.nextElementSibling;
      // if (nextEl) nextEl.scrollIntoView();
      // if (el) el.scrollIntoView();

      // while (lastChildChildren.length > 0) {
        // scroll into view lastChild
        // lastChild.scrollIntoView();
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }
    }
    
    const observer = new MutationObserver(logNewNodes);
    observer.observe(document.querySelector('.vyucnb').parentElement.children[8], { childList: true });
  });

  await scrollTopAndBottom(page);

  return allElements;
}

exports.scrollAndCollectElements = scrollAndCollectElements;
