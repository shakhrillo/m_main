const logger = require('./logger');
const wait = require('./wait');

async function clickReviewTab(page) {
  logger.info('Clicking review tab');
  const allButtons = await page.$$('button[role="tab"][aria-selected="false"]');
  
  if (!allButtons.length) {
    logger.error('No review tab found');
    return;
  }

  for (const button of allButtons) {
    const tabText = await button.evaluate(el => el.textContent);
    if (tabText.toLowerCase().includes('reviews')) {
      logger.info('Clicking review tab');
      await button.click();
      break;
    }
  }
}

async function getReviewsContainer(page) {
  logger.info('Getting reviews container');

  try {
    await page.waitForSelector('.vyucnb', { timeout: 5000 });
  } catch (error) {
    logger.error('Reviews container did not load in time');
    return null;
  }

  const vyucnb = await page.$$('.vyucnb');
  let parentElm;

  if (vyucnb.length) {
    parentElm = await page.evaluateHandle(el => el.parentElement, vyucnb[0]);
  } else {
    logger.error('No reviews container found');
  }

  return parentElm;
}

async function getReviewElements(parent, allElements = []) {
  let lastChildId;
  
  if (allElements.length) {
    const lastChild = allElements[allElements.length - 1];
    lastChildId = lastChild.id;
  }

  try {
    const parentChildren = await parent.$$(':scope > *');
    const beforeTheLastChild = parentChildren[parentChildren.length - 2];
    const beforeTheLastChildChildren = await beforeTheLastChild.$$(':scope > *');
    let isNewElements = !lastChildId;

    await Promise.all(beforeTheLastChildChildren.map(async (child) => {
      const elementId = await child.evaluate(el => el.getAttribute('data-review-id'));
      if (!elementId) return;

      if (elementId === lastChildId && !isNewElements) {
        isNewElements = true;
        return;
      }

      if (isNewElements) {
        allElements.push({
          id: elementId,
          element: child,
          text: await child.evaluate(el => el.textContent),
        }); 
      }
    }));

  } catch (error) {
    console.error("Error finding elements:", error);
  }

  return allElements;
}

async function checkInfiniteScroll(reviewsContainer) {
  let lastChild = await reviewsContainer.evaluateHandle(el => el.lastElementChild);
  const lastChildChildren = await lastChild.evaluate(el => Array.from(el.children));

  return {
    lastChild,
    completed: lastChildChildren.length === 0,
  }
}

async function scrollAndCollectElements(page) {
  const reviewsContainer = await getReviewsContainer(page);
  let isScrollFinished = false;
  let allElements = [];

  while (!isScrollFinished) {
    allElements = await getReviewElements(reviewsContainer, allElements);
    const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
    
    if (completed) {
      isScrollFinished = true;
      break;
    }

    await page.evaluate(el => el.scrollIntoView(), lastChild);
  }

  return allElements;
}

module.exports = { clickReviewTab, scrollAndCollectElements };
