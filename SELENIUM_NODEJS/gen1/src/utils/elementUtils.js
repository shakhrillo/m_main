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
async function ensureButtonInViewport(button) {
  const isButtonInViewport = await button.isIntersectingViewport();
  if (!isButtonInViewport) {
    await button.scrollIntoView();
    await wait(500);
  }
}

async function clickExpandReviewAndResponse(page) {
  const allButtons = await page.$$('button[aria-expanded="false"], button[aria-checked="true"]');
  logger.info('Clicking expand review and response buttons');

  for (const button of allButtons) {
    const jsaction = await button.evaluate(el => el.getAttribute('jsaction'));
    if (jsaction && jsaction.includes('review.expandReview')) {
      await ensureButtonInViewport(button);
      await button.click();
      logger.info('Clicked expand review button');
    } else if (jsaction && jsaction.includes('review.showReviewInOriginal')) {
      await ensureButtonInViewport(button);
      await button.click();
      logger.info('Clicked show review in original button');
    } else if (jsaction && jsaction.includes('review.expandOwnerResponse')) {
      await ensureButtonInViewport(button);
      await button.click();
      logger.info('Clicked expand owner response button');
    } else if (jsaction && jsaction.includes('review.showOwnerResponseInOriginal')) {
      await ensureButtonInViewport(button);
      await button.click();
      logger.info('Clicked show owner response in original button');
    }
  }
}

function extractReviewTextInner(reviewTextArray, myendText) {
  if (!reviewTextArray || reviewTextArray.length === 0) {
    return {};
  }
  let user = reviewTextArray[0];
  let userInformation = reviewTextArray[1];
  let rate = reviewTextArray.find(text => text.includes("/5"));
  let time = "";
  let platform = 'Google';
  let response = "";
  let responseTime = "";


  let reviewText = {};
  let startIndex = -1;
  let endIndex = reviewTextArray.length;

  if(!time) {
    for (let i = 0; i < reviewTextArray.length; i++) {
      const reviewText = reviewTextArray[i];
      if (reviewText && reviewText.toLowerCase().includes(" ago")) {
        time = reviewTextArray[i];

        if (reviewText.toLowerCase().includes("ago on")) {
          startIndex = i + 1; // Skip the 'ago on'
          platform = reviewTextArray[i + 1];
        } else {
          startIndex = i;
        }

        break;
      }
    }  
  }

  for (let i = startIndex; i < reviewTextArray.length; i++) {
    // if Read more on includes remove array from that index
    if (reviewTextArray[i] && reviewTextArray[i].toLowerCase().includes("read more on")) {
      reviewTextArray = reviewTextArray.slice(0, i);
      break;
    }
  }

  // Find the index of 'Response from the owner' to stop extraction before it
  for (let i = startIndex; i < reviewTextArray.length; i++) {
    if (reviewTextArray[i] && reviewTextArray[i].toLowerCase() === 'like') {
      endIndex = i;
      endIndex -= 1; // Skip the 'like'
      break;
    } else if (reviewTextArray[i] && reviewTextArray[i].toLowerCase() === 'share') {
      endIndex = i;
      endIndex -= 1; // Skip the 'share'
      break;
    }
  }

  // Extract review text if startIndex is valid
  if (startIndex !== -1) {
    startIndex += 1;
    if(reviewTextArray[startIndex] && reviewTextArray[startIndex].toLowerCase() === "new") { // Skip the 'new' if it exists
      startIndex += 1;
    }
    const reviewTextArr = reviewTextArray.slice(startIndex, endIndex);
    const reviewObj = {}
    const reviewOverview = []

    for (let i = 0; i < reviewTextArr.length; i++) {
      const textValue = reviewTextArr[i];
      const containsOnlyDigit = /^\d+$/.test(textValue);
      let nextTextValue = reviewTextArr[i + 1] || '';

      if (
        myendText && 
        !myendText.includes(textValue) && 
        !textValue.includes('') &&
        !textValue.includes('See translation (English)') &&
        !nextTextValue.includes('') &&
        !containsOnlyDigit
      ) {
        // remove from myendText
        myendText = myendText.replace(textValue, '');

        const nextTextValue = reviewTextArr[i + 1];
        // Check if 'nextTextValue' exists and does not contain a digit
        const nextTextValueExists = nextTextValue !== undefined;
        const nextTextValueContainsDigit = nextTextValueExists && /\d/.test(nextTextValue);
        const currentTextValueContainsDigit = /\d/.test(textValue);
        if (
          nextTextValueExists && 
          // !nextTextValueContainsDigit && 
          !currentTextValueContainsDigit
        ) {
          reviewObj[textValue] = nextTextValue;
          // Skip the next iteration as it has already been processed
          i += 1;
        } else {
          // If conditions are not met, add 'textValue' to 'reviewOverview'
          reviewOverview.push(textValue);
        }
      }
    }    

    reviewText = {
      reviewObj,
      reviewOverview
    }

    // remove See translation (English) if it exists
    // reviewText = reviewText.replace('See translation (English)', '');

    // // remove more than one space
    // reviewText = reviewText.replace(/\s{2,}/g, ' ');

    // // remove everything after  if exists
    // if (reviewText.includes('')) {
    //   reviewText = reviewText.split('')[0];
    // }

    // // remove this 
    // reviewText = reviewText.replace(//g, "");


    // // remove end spaces
    // reviewText = reviewText.trim();
  }

  // Extract response if it exists
  let responseStartIndex = -1;
  for (let i = 0; i < reviewTextArray.length; i++) {
    if (reviewTextArray[i] && reviewTextArray[i].toLowerCase() === 'share' && !!reviewTextArray[i + 1]) {
      // remove these word Response from the owner
      responseTime = reviewTextArray[i + 1].replace('Response from the owner', '').trim();
      responseStartIndex = i + 1;
      break;
    }
  }

  if (responseStartIndex < 0) {
    for (let i = 0; i < reviewTextArray.length; i++) {
      if (reviewTextArray[i] && reviewTextArray[i].toLowerCase() === 'response from the owner' && !!reviewTextArray[i + 1]) {
        // remove these word Response from the owner
        responseTime = reviewTextArray[i + 1].replace('Response from the owner', '').trim();
        responseStartIndex = i + 1;
        break;
      }
    }
  }

  if (responseStartIndex !== -1) {
    response = reviewTextArray.slice(responseStartIndex + 1).join(" ").trim();
    response = response.replace('See translation (English)', '');
  }

  return {
    user: user ? user : "",
    userInformation: userInformation ? userInformation : "",
    rate: rate ? rate : "",
    time: time ? time : "",
    platform: platform,
    reviewText: reviewText,
    response: response,
    responseTime: responseTime,
    myendText: myendText
  }
}

async function extractReviewText(page, elementHandle) {
  // Get the text content of the element
  const reviewText = await page.evaluate(el => el.innerText, elementHandle);
  const reviewTextArray = reviewText.split('\n');

  let myendText = "";

  // Select elements with the class name "MyEned"
  const reviewMyenedHandles = await elementHandle.$$('.MyEned');
  if (reviewMyenedHandles.length > 0) {
    // Get the first child element and its text
    const reviewMyenedFirstChildHandle = await reviewMyenedHandles[0].$('*');
    if (reviewMyenedFirstChildHandle) {
      myendText = await page.evaluate(el => el.innerText, reviewMyenedFirstChildHandle);
    }
  }

  return extractReviewTextInner(reviewTextArray, myendText);
}

async function getReviewElements(page, parent, lastChildId) {
  // let lastChildId;
  let elements = [];
  
  // if (allElements.length) {
  //   const lastChild = allElements[allElements.length - 1];
  //   lastChildId = lastChild.id;
  // }

  try {
    const parentChildren = await parent.$$(':scope > *');
    const beforeTheLastChild = parentChildren[parentChildren.length - 2];
    const beforeTheLastChildChildren = await beforeTheLastChild.$$(':scope > *');
    let isNewElements = !lastChildId;

    console.log('lastChildId:', lastChildId);

    await Promise.all(beforeTheLastChildChildren.map(async (child) => {
      const elementId = await child.evaluate(el => el.getAttribute('data-review-id'));
      if (!elementId) return;

      if (elementId === lastChildId && !isNewElements) {
        isNewElements = true;
        return;
      }

      if (isNewElements) {
        elements.push({
          id: elementId,
          element: child,
          textContent: await extractReviewText(page, child),
          text: await child.evaluate(el => el.textContent),
        }); 
      }
    }));

  } catch (error) {
    console.error("Error finding elements:", error);
  }

  return elements;
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
    await clickExpandReviewAndResponse(page);
    const elements = await getReviewElements(page, reviewsContainer, allElements[allElements.length - 1]?.id);
    allElements.push(...elements);
    logger.info(`Collected ${allElements.length} elements`);
    
    const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
    
    if (completed) {
      isScrollFinished = true;
      break;
    }

    await page.evaluate(el => el.scrollIntoView(), lastChild);
    await wait(2000);
  }

  return allElements;
}

module.exports = { clickReviewTab, scrollAndCollectElements };
