const { updateReview } = require('../controllers/reviewController');
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
  }
}

async function clickExpandReviewAndResponse(page) {
  const allButtons = await page.$$('button[jsaction*="review.expandReview"], button[jsaction*="review.showReviewInOriginal"], button[jsaction*="review.expandOwnerResponse"], button[jsaction*="review.showOwnerResponseInOriginal"]');
  for (const button of allButtons) {
    await ensureButtonInViewport(button);
    await button.click();
    await wait(1000);
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

async function getOwnerResponse(reviewElement) {
  let ownerResponseText = '';

  // Locate the star rating element
  const starRatingElement = await reviewElement.$('span[role="img"][aria-label*="stars"]');
  if (!starRatingElement) return ownerResponseText; // Return empty if no star rating element is found

  // Traverse up to locate the parent element that contains additional review details
  const reviewDetailContainer = await starRatingElement.evaluateHandle(element => element.parentElement.parentElement);
  const responseContainer = await reviewDetailContainer.evaluateHandle(element => element.lastElementChild);

  // Check if this element contains the "Response from the owner" text
  const responseContainerText = await responseContainer.evaluate(element => element.textContent);
  if (responseContainerText.includes('Response from the owner')) {
    const responseTextElement = await responseContainer.evaluateHandle(element => element.lastElementChild);
    ownerResponseText = await responseTextElement.evaluate(element => element.textContent);
  }

  return ownerResponseText;
}

async function getOwnerResponseTime(reviewElement) {
  let ownerResponseDate = '';

  // Locate the star rating element
  const starRatingElement = await reviewElement.$('span[role="img"][aria-label*="stars"]');
  if (!starRatingElement) return ownerResponseDate; // Return empty if no star rating element is found

  // Traverse up to locate the parent element that contains additional review details
  const reviewDetailContainer = await starRatingElement.evaluateHandle(element => element.parentElement.parentElement);
  const responseContainer = await reviewDetailContainer.evaluateHandle(element => element.lastElementChild);

  // Check if this element contains the "Response from the owner" text
  const responseContainerText = await responseContainer.evaluate(element => element.textContent);
  if (responseContainerText.includes('Response from the owner')) {
    const responseTextElement = await responseContainer.evaluateHandle(element => element.firstElementChild);
    ownerResponseDate = await responseTextElement.evaluate(element => element.textContent);
    ownerResponseDate = ownerResponseDate.split('Response from the owner')[1].trim();
  }

  return ownerResponseDate;
}

async function extractReviewText(element) {
  const reviewContainer = await element.$$('.MyEned');
  if (!reviewContainer.length) {
    return '';
  }
  const reviewText = await reviewContainer[0].$('span');
  const textContent = await reviewText.evaluate(el => el.textContent);
  return textContent;
}

async function extractImageUrlsFromButtons(page, reviewId) {
  const extractedImageUrls = [];
  const allButtons = await page.$$(`button[data-review-id="${reviewId}"][jsaction*="review.openPhoto"]`);

  for (const button of allButtons) {
    const imageUrl = await button.evaluate(el => {
      const style = el.getAttribute('style');
      if (style) {
        const imageUrl = style.split('url("')[1]?.split('");')[0];
        if (imageUrl) {
          return imageUrl.split('=')[0] + '=w1200';
        }
      }
    });
    if (imageUrl) {
      extractedImageUrls.push(imageUrl);
    }
  }

  return extractedImageUrls;
}

async function extractRating(element) {
  const rateElement = await element.$('span[role="img"][aria-label*="stars"]');
  if (!rateElement) {
    return null;
  }
  const rateText = await rateElement.evaluate(el => el.getAttribute('aria-label'));
  return rateText;
}

async function getReviewDate(element) {
  const starRatingElement = await element.$('span[role="img"][aria-label*="stars"]');
  if (!starRatingElement) {
    return null;
  }
  const reviewDateElement = await starRatingElement.evaluateHandle(el => el.nextElementSibling);
  const reviewDateText = await reviewDateElement.evaluate(el => el.innerText);
  return reviewDateText;
}

async function extractQuestions(element) {
  const MyEned = await element.$$('.MyEned');

  const extractedQA = [];

  let rateElementParentNextSiblingLastChildChildren;

  if(MyEned.length) {
    const MyEnedLastChildren = await MyEned[0].$$(':scope > *');
    if (MyEnedLastChildren.length < 2) {
      return [];
    }
    rateElementParentNextSiblingLastChildChildren = await MyEnedLastChildren[1].$$(':scope > *');
  } else {
    const rateElement = await element.$('span[role="img"][aria-label*="stars"]');
    if (!rateElement) {
      return [];
    }

    const rateElementParent = await rateElement.evaluateHandle(el => el.parentElement?.nextElementSibling?.firstElementChild);
    if (!rateElementParent || JSON.stringify(rateElementParent) === '{}') {
      rateElementParentNextSiblingLastChildChildren = [];
    } else {
      rateElementParentNextSiblingLastChildChildren = await rateElementParent.$$(':scope > *');
    }
  }

  for (const questionContainer of rateElementParentNextSiblingLastChildChildren) {
    const question = await questionContainer.evaluate(el => el.innerText);
    extractedQA.push(question);
  }

  return extractedQA;
}

async function extractReviewer(page, reviewId) {
  const reviewerButton = await page.$$(`button[jsaction*="review.reviewerLink"][data-review-id="${reviewId}"]`);

  if (!reviewerButton.length) return null;

  const results = {
    name: '',
    info: '',
    href: '',
    content: '',
  }

  for (const button of reviewerButton) {
    const {href, content} = await button.evaluate(el => {
      const href = el.getAttribute('data-href')
      const content = el.innerText.split('\n')

      return { href, content };
    });

    results.name = content[0] || '';
    results.info = (content[1] || '').split('·').map((item) => item.trim());
    results.href = href;
    results.content = content;
  }

  return results;
}

async function getReviewElements(page, reviewContainer, lastFetchedReviewId) {
  const newReviewElements = [];

  const fetchReviewDetails = async (reviewElement, reviewId) => ({
    id: reviewId,
    element: reviewElement,
    review: await extractReviewText(reviewElement),
    date: await getReviewDate(reviewElement),
    response: await getOwnerResponse(reviewElement),
    responseTime: await getOwnerResponseTime(reviewElement),
    imageUrls: await extractImageUrlsFromButtons(page, reviewId),
    rating: await extractRating(reviewElement),
    qa: await extractQuestions(reviewElement),
    user: await extractReviewer(reviewElement, reviewId)
  });

  if (lastFetchedReviewId) {
    console.log('Last fetched review ID:', lastFetchedReviewId);
    const lastFetchedReviewElement = await reviewContainer.$(`.jftiEf[data-review-id="${lastFetchedReviewId}"]`);

    if (!lastFetchedReviewElement) {
      console.log('Last fetched review element not found');
      return newReviewElements;
    }

    let nextSiblingElement = await lastFetchedReviewElement.evaluateHandle(el => el.nextElementSibling);

    while (nextSiblingElement) {
      const reviewId = await nextSiblingElement.evaluate(el => el?.getAttribute('data-review-id'));
      if (reviewId) {
        newReviewElements.push(await fetchReviewDetails(nextSiblingElement, reviewId));
      }

      const nextElement = await nextSiblingElement.evaluateHandle(el => el.nextElementSibling);
      if (!nextElement || JSON.stringify(nextElement) === '{}') {
        console.log('No more siblings');
        break;
      }
      nextSiblingElement = nextElement;
    }
  } else {
    const reviewContainerChildren = await reviewContainer.$$(':scope > *');
    const secondLastChild = reviewContainerChildren[reviewContainerChildren.length - 2];
    const secondLastChildDescendants = await secondLastChild.$$(':scope > *');
    let shouldFetchNewElements = !lastFetchedReviewId;

    for (const childElement of secondLastChildDescendants) {
      const reviewId = await childElement.evaluate(el => el.getAttribute('data-review-id'));
      if (!reviewId) continue;

      if (reviewId === lastFetchedReviewId && !shouldFetchNewElements) {
        shouldFetchNewElements = true;
        continue;
      }

      if (shouldFetchNewElements) {
        newReviewElements.push(await fetchReviewDetails(childElement, reviewId));
      }
    }
  }

  return newReviewElements;
}

async function checkInfiniteScroll(reviewsContainer) {
  let lastChild = await reviewsContainer.evaluateHandle(el => el.lastElementChild);
  const lastChildChildren = await lastChild.evaluate(el => Array.from(el.children));

  return {
    lastChild,
    completed: lastChildChildren.length === 0,
  }
}

async function scrollAndCollectElements(page, uid, pushId) {
  const reviewsContainer = await getReviewsContainer(page);
  let isScrollFinished = false;
  let allElements = [];
  let lastId = null;

  while (!isScrollFinished) {
    try {
      const { lastChild, completed } = await checkInfiniteScroll(reviewsContainer);
      await clickExpandReviewAndResponse(page);
      lastId = allElements[allElements.length - 1]?.id;
      const elements = await getReviewElements(page, reviewsContainer, allElements[allElements.length - 1]?.id);
      allElements.push(...elements);
      console.log(`Collected ${allElements.length} elements`);

      await updateReview(uid, pushId, {
        extractedReviews: allElements.length,
      });
      
      if (completed) {
        isScrollFinished = true;
        console.log("Scrolling completed");
        break;
      }

      const isLastChildInViewport = await lastChild.isIntersectingViewport();
      if (!isLastChildInViewport) {
        await page.evaluate(el => el.scrollIntoView(), lastChild);
      }

      console.log("Scrolling a little bit more");
      await wait(400);
    } catch (error) {
      console.error("Error scrolling and collecting elements:", error);
    }
  }

  return allElements;
}

module.exports = { clickReviewTab, scrollAndCollectElements };
