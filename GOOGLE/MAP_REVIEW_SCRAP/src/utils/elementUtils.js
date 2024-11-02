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

async function extractReviewRating(element, reviewId) {
  const ratingElement = await element.$('span[role="img"][aria-label*="stars"]');
  if (!ratingElement) {
    const thumbsUpButton = await element.$(`button[data-review-id="${reviewId}"][jsaction*="review.toggleThumbsUp"]`);
    if (!thumbsUpButton) {
      const firstChildElement = await element.evaluateHandle(el => 
        el?.firstElementChild?.firstElementChild?.lastElementChild?.firstElementChild
      );

      if (!firstChildElement) return '';

      const spanElements = await firstChildElement.$$('span');
      if (!spanElements || spanElements.length < 2) {
        return '';
      }
      return spanElements[0].evaluate(el => el.innerText);
    }
    
    const secondChildElement = await thumbsUpButton.evaluateHandle(el => {
      const parentElement = el.parentElement?.parentElement;
      return parentElement?.firstElementChild?.children[0];
    });
    
    if (!secondChildElement) return '';
    const innerText = await secondChildElement.evaluate(el => el.innerText);
    
    return innerText;
  }
  const ratingText = await ratingElement.evaluate(el => el.getAttribute('aria-label'));
  return ratingText;
}

async function getReviewDate(element, reviewId) {
  const starRatingElement = await element.$('span[role="img"][aria-label*="stars"]');
  if (!starRatingElement) {
    const thumbsUpButton = await element.$(`button[data-review-id="${reviewId}"][jsaction*="review.toggleThumbsUp"]`);
    if (!thumbsUpButton) {
      const firstChild = await element.evaluateHandle(el => 
        el?.firstElementChild?.firstElementChild?.lastElementChild?.firstElementChild
      );

      if (!firstChild) return '';

      const secondChildDiv = await firstChild.$$('span');
      if (!secondChildDiv || secondChildDiv.length < 2) {
        return '';
      }
      return secondChildDiv[1].evaluate(el => el.innerText);
    }
    
    const secondChild = await thumbsUpButton.evaluateHandle(el => {
      const parent = el.parentElement?.parentElement;
      return parent?.firstElementChild?.children[1];
    });
    
    if (!secondChild) return '';
    const innerText = await secondChild.evaluate(el => el.innerText);
    
    return innerText;
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

  const fetchReviewDetails = async (reviewElement, reviewId) => {
    const buttons = await reviewElement.$$(`
      button[data-review-id="${reviewId}"][jsaction*="review.expandReview"],
      button[jsaction*="review.showReviewInOriginal"],
      button[jsaction*="review.expandOwnerResponse"],
      button[jsaction*="review.showOwnerResponseInOriginal"]
    `);

    for (const button of buttons) {
      await ensureButtonInViewport(button);
      await button.click();
      await wait(200);
    }
  
    return {
      id: reviewId,
      element: reviewElement,
      review: await extractReviewText(reviewElement),
      date: await getReviewDate(reviewElement, reviewId),
      response: await getOwnerResponse(reviewElement),
      responseTime: await getOwnerResponseTime(reviewElement),
      imageUrls: await extractImageUrlsFromButtons(page, reviewId),
      rating: await extractReviewRating(reviewElement, reviewId),
      qa: await extractQuestions(reviewElement),
      user: await extractReviewer(reviewElement, reviewId)
    }
  };

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
