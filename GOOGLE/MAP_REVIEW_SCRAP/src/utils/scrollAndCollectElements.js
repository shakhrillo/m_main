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
let stopScrol = false;
function stopScrolling() {
  console.log('Stop scrolling');
  stopScrol = true;
}
async function scrollAndCollectElements(page, uid, pushId, limit) {
  page.exposeFunction('stopScrolling', stopScrolling);

  const reviewsContainer = await getReviewsContainer(page);
  if (!reviewsContainer) {
    console.error('Reviews container not found');
    return [];
  }
  
  let isScrollFinished = false;
  let allElements = [];
  let lastId = null;

  const startTimestamp = Date.now();
  let lastLoggedTime = 0;
  let scrollCount = 0;

  // scroll bottom .vyucnb
  await page.evaluate(() => {
    const el = document.querySelector('.vyucnb');
    const nextEl = el.nextElementSibling;
    if (nextEl) nextEl.scrollIntoView();
  });

  // scroll top .vyucnb
  await page.evaluate(() => {
    const el = document.querySelector('.vyucnb');
    if (el) el.scrollIntoView();
  });
  await wait(100);
  await wait(3000);

  await page.evaluate(async () => {
    // let count = 0;
    function logNewNodes(records) {
      // if (count >= 10) {
      //   stopScrolling();
      // }

      for (const record of records) {
        // Check if the childlist of the target node has been mutated
        if (record.type === "childList") {
          const addedNodes = Array.from(record.addedNodes);
          // record.getAttribute("data-review-id");
          const addedNodeIds = addedNodes.map(node => node.getAttribute("data-review-id")).filter(Boolean);
          
          puppeteerMutationListener(addedNodeIds, uid, pushId);
          // count++;
          stopScrolling();
        }
      }
    }
    
    const observer = new MutationObserver(logNewNodes);
    observer.observe(document.querySelector('.vyucnb').parentElement.children[8], { childList: true });
  });

  while (!isScrollFinished) {
    scrollCount++;

    try {
      const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
      const updatedTimestamp = Date.now();
      const spentInMinutes = (updatedTimestamp - startTimestamp) / 1000 / 60;

      if (completed || stopScrol) {
        isScrollFinished = true;
        console.info('Scrolling completed, all elements collected');
        break;
      }
      
      if (lastChild) {
        const reviewContainerChildren = await reviewsContainer.$$(':scope > *');
        const secondLastChild = reviewContainerChildren[reviewContainerChildren.length - 2];
        const secondLastChildDescendants = await secondLastChild.$$(':scope > *');
        const _lastChild = secondLastChildDescendants[secondLastChildDescendants.length - 3];

        const _isLastChildInViewport = await lastChild.isIntersectingViewport();
        if (!_isLastChildInViewport) {
          await page.evaluate(el => el.scrollIntoView(), _lastChild);
        }

        await wait(50);

        const isLastChildInViewport = await lastChild.isIntersectingViewport();
        if (!isLastChildInViewport) {
          await page.evaluate(el => el.scrollIntoView(), lastChild);
        }
      }

      await wait(10000); // Wait for a short duration to allow more reviews to load
    } catch (error) {
      console.error('Error scrolling and collecting elements:', error);
      isScrollFinished = true; // Exit the loop on error
    }
  }

  return allElements;
}

exports.scrollAndCollectElements = scrollAndCollectElements;
