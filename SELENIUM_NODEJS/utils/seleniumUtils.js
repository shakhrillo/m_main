const { By } = require('selenium-webdriver');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function findElementsByXPath(driver, xpath) {
  return await driver.findElements(By.xpath(xpath));
}

async function getElementAttributes(driver, element, attributes) {
  const attributeValues = {};

  // Loop through the list of attributes
  for (const attr of attributes) {
    try {
      // Get the attribute value
      attributeValues[attr] = await element.getAttribute(attr);
    } catch (error) {
      console.error(`Error getting attribute ${attr}:`, error);
      attributeValues[attr] = null; // or handle it as needed
    }
    
    // Sleep for a random duration between 80 and 200 ms
    // await driver.sleep(getRandomNumber(80, 200));
  }

  return attributeValues;
}

async function openOverviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  const attributesToExtract = ['data-tab-index', 'aria-selected'];
  let isOverviewTabSelectedAlready = false;

  for (const button of allButtons) {
    const { 'data-tab-index': dataTabIndex, 'aria-selected': areaSelected } = await getElementAttributes(driver, button, attributesToExtract);
    
    if (dataTabIndex === '0' && areaSelected === 'false') {
      isOverviewTabSelectedAlready = false;
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      break;
    } else {
      isOverviewTabSelectedAlready = true;
    }
  }

  if (isOverviewTabSelectedAlready) {
    console.log('Already overview tab is selected');
  } else {
    console.log('Opening overview tab');
  }
}

async function openReviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  let isReviewTabSelectedAlready = false;

  for (const button of allButtons) {
    const tabText = await button.getText();
    if (tabText.toLowerCase().includes('reviews')) {
      isReviewTabSelectedAlready = false
      await button.click();
      await driver.sleep(getRandomNumber(1000, 3000));
      break;
    } else {
      isReviewTabSelectedAlready = true;
    }
  }

  if (isReviewTabSelectedAlready) {
    console.log('Already review tab is selected');
  } else {
    console.log('Opening review tab');
  }
}

async function reviewTabParentElement(driver) {
  let parentElm = null;
  const vyucnb = await driver.findElements(By.className("vyucnb"));
  if (vyucnb.length > 0) {
    parentElm = await vyucnb[0].findElement(By.xpath("parent::*"));
  }

  return {parentElm};
}

// async function beforeTheLastChildInsideParentChildren(parent, lastElement) {
async function beforeTheLastChildInsideParentChildren(parent, lastElementId = null) {
  const allElements = [];
  let lastValidElementId = lastElementId || null;
  let lastChildChildrenLength = 0;

  try {
    // Get the second-to-last child in the parent's children
    const lastChild = await parent.findElement(By.xpath("child::*[last()]"));
    const lastChildChildren = await lastChild.findElements(By.xpath("child::*"));
    lastChildChildrenLength = lastChildChildren.length;
    // const lastChild = await parent.findElement(By.xpath("child::*[last()]"));
    // lastChildChildren = await lastChild.findElements(By.xpath("child::*")).length;
    
    const beforeTheLastChild = await parent.findElement(By.xpath("child::*[last()-1]"));
    
    // Determine the starting element based on lastElementId or use the first child of beforeTheLastChild
    let startingElement = lastElementId
      ? await beforeTheLastChild.findElement(By.xpath(`child::*[@data-review-id="${lastElementId}"]`))
      : await beforeTheLastChild.findElement(By.xpath("child::*[1]"));
    
    // Check if startingElement exists and find the first following sibling
    let nextElement = startingElement
      ? await startingElement.findElement(By.xpath("following-sibling::*")).catch(() => null)
      : null;

    while (nextElement) {
      
      const elementId = await nextElement.getAttribute("data-review-id");
      if (elementId) {
        lastValidElementId = elementId;
        allElements.push({
          id: elementId,
          element: nextElement
        });
      }

      // Move to the next sibling, if it exists
      nextElement = await nextElement.findElement(By.xpath("following-sibling::*")).catch(() => null);
    }
  } catch (error) {
    console.error("Error finding elements:", error);
  }

  return {allElements, lastValidElementId, lastChildChildrenLength};
}
  

async function getAllAfterElementTillEnd(parent, element) {
  console.log('Getting all elements after the specified element');
  const allChildren = await parent.findElements(By.xpath("child::*"));
  console.log('Total children:', allChildren.length);

  // Get the unique attribute (like `data-review-id`) of the target element
  const targetAttribute = await element.getAttribute("data-review-id");
  let startIndex = -1;

  // Find the index by comparing unique attribute values
  for (let i = 0; i < allChildren.length; i++) {
    const childAttribute = await allChildren[i].getAttribute("data-review-id");
    if (childAttribute === targetAttribute) {
      startIndex = i;
      break;
    }
  }

  // Return elements after the target element if found
  return startIndex !== -1 ? allChildren.slice(startIndex) : [];
}

async function lastChildInsideParent(parent) {
  const lastChild = await parent.findElement(By.xpath("child::*[last()]"));
  const lastChildChildren = await lastChild.findElements(By.xpath("child::*"));

  return lastChildChildren.length;
}

async function scrollToBottom(driver, parentElm) {
  const allFilteredReviews = new Map();
  const extractedMessages = [];
  let previousScrollHeight = await parentElm.getAttribute("scrollHeight");

  console.log('Starting scroll to bottom of the page');
  await initialScroll(driver, parentElm);

  // Continuously scroll until bottom is reached
  while (await continueScrolling(driver, parentElm, previousScrollHeight)) {
    previousScrollHeight = await parentElm.getAttribute("scrollHeight");
    
    const filteredReviews = await filterSingleChildReviews(parentElm);
    console.log('Filtered reviews length:', filteredReviews.length);
    for (const filteredReview of filteredReviews) {
      const dataReviewId = await filteredReview.getAttribute("data-review-id");
      const message = {
        ...(await extractReviewText(filteredReview)),
        imageUrls: await extractImageUrlsFromButtons(filteredReview, driver),
        dataReviewId
      };

      extractedMessages.push(message);
    }
  }

  console.log('Extracted messages length:', extractedMessages.length);

  await driver.sleep(getRandomNumber(2000, 3000));
  console.log('Starting to extract reviews');

  let allButtons = [];
  try {
    allButtons = await findElementsByXPath(parentElm, "//button");
    // Continue with your logic
  } catch (error) {
    console.error("Error finding buttons:", error);
  }
  console.log('All buttons length:', allButtons.length);
  // await driver.sleep(getRandomNumber(2000, 3000));
  // const categorizedButtons = categorizeButtons(await extractButtonAttributes(driver, allButtons));
  // console.log('Categorized buttons:', categorizedButtons.showMorePhotos.length, categorizedButtons.expandReview.length, categorizedButtons.showReviewInOriginal.length, categorizedButtons.expandOwnerResponse.length, categorizedButtons.showOwnerResponseInOriginal.length);

  // // Click on all relevant buttons
  // await clickAllButtons(categorizedButtons);

  // Collect unique reviews
  // const filteredReviews = await filterSingleChildReviews(parentElm);
  // console.log('Filtered reviews length:', filteredReviews.length);
  // // await extractReviews(filteredReviews, allFilteredReviews, extractedMessages, driver);

  // for (const filteredReview of filteredReviews) {
  //   const message = {
  //     ...(await extractReviewText(filteredReview)),
  //     imageUrls: await extractImageUrlsFromButtons(filteredReview, driver),
  //   };

  //   extractedMessages.push(message);
  // }

  // console.log('Extracted messages length:', extractedMessages.length);
  return extractedMessages;
}

// Helper functions
async function initialScroll(driver, parentElm) {
  await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
  await driver.sleep(getRandomNumber(2000, 3000));
}

async function continueScrolling(driver, parentElm, previousScrollHeight) {
  await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
  await driver.sleep(getRandomNumber(2000, 3000));

  const currentScrollHeight = await parentElm.getAttribute("scrollHeight");
  if (currentScrollHeight === previousScrollHeight) {
    console.log('Scrolling finished');
    return false;
  }
  return true;
}

async function extractButtonAttributes(driver, buttons) {
  return await Promise.all(buttons.map(async (button) => {
    const attributes = await getElementAttributes(driver, button, ['jsaction', 'aria-expanded', 'aria-checked', 'data-review-id']);
    await driver.sleep(getRandomNumber(80, 200));
    return { ...attributes, button };
  }));
}

function categorizeButtons(buttons) {
  const categories = {
    showMorePhotos: [],
    expandReview: [],
    showReviewInOriginal: [],
    expandOwnerResponse: [],
    showOwnerResponseInOriginal: []
  };

  buttons.forEach(({ jsaction, ariaExpanded, ariaChecked, button }) => {
    if (jsaction?.includes('review.showMorePhotos')) categories.showMorePhotos.push(button);
    if (jsaction?.includes('review.expandReview') && ariaExpanded === 'false') categories.expandReview.push(button);
    if (jsaction?.includes('review.showReviewInOriginal') && ariaChecked === 'true') categories.showReviewInOriginal.push(button);
    if (jsaction?.includes('review.expandOwnerResponse') && ariaExpanded === 'false') categories.expandOwnerResponse.push(button);
    if (jsaction?.includes('review.showOwnerResponseInOriginal')) categories.showOwnerResponseInOriginal.push(button);
  });

  return categories;
}

async function clickAllButtons(categorizedButtons) {
  await Promise.all(Object.values(categorizedButtons).flat().map(button => button.click()));
}

async function extractReviews(filteredReviews, allFilteredReviews, extractedMessages, driver) {
  // for (const { dataReviewId, element } of filteredReviews) {
  //   if (!allFilteredReviews.has(dataReviewId)) {
  //     allFilteredReviews.set(dataReviewId, element);
      
  //     const message = {
  //       ...(await extractReviewText(element)),
  //       imageUrls: await extractImageUrlsFromButtons(element, driver),
  //     };

  //     extractedMessages.push(message);
  //   }
  // }

  for (const filteredReview of filteredReviews) {
    const message = {
      ...(await extractReviewText(filteredReview)),
      imageUrls: await extractImageUrlsFromButtons(filteredReview, driver),
    };

    extractedMessages.push(message);
  }
}


async function clickShowMorePhotosButton(allButtons, driver) {
  // const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction'];
  const startedTime = new Date().getTime();
  
  console.log('Clicking all buttons to show more photos');
  for (const button of allButtons) {
    const { 'jsaction': jsaction } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.showMorePhotos')) {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickExpandReviewButtons(allButtons, driver) {
  // const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-expanded'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to expand reviews');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-expanded': ariaExpanded } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.expandReview') && ariaExpanded === 'false') {
      await button.click();
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickShowReviewInOriginalButtons(allButtons, driver) {
  // const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-checked'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to show original reviews');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-checked': ariaChecked } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.showReviewInOriginal') && ariaChecked === 'true') {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickExpandOwnerResponseButtons(allButtons, driver) {
  // const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-expanded'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to expand owner responses');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-expanded': ariaExpanded } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.expandOwnerResponse') && ariaExpanded === 'false') {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickShowOwnerResponseInOriginalButtons(allButtons, driver) {
  // const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to show owner responses');
  for (const button of allButtons) {
    const { 'jsaction': jsaction } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.showOwnerResponseInOriginal')) {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function filterSingleChildReviews(driver) {
  const filteredReviews = [];
  
  // fontBodyMedium
  // const allElements = await driver.findElements(By.xpath("//div[contains(@class, 'jftiEf')]//div[contains(@class, 'fontBodyMedium')]"));
  // const allElements = await findElementsByXPath(driver, "//div[@data-review-id]");
  const allElements = await driver.findElements(By.xpath("//div[contains(@class, 'jftiEf') and contains(@class, 'fontBodyMedium')]"));
  console.log('Checking allElements:', allElements.length);

  return allElements;
  
  // Use Promise.all to concurrently check each element
  await Promise.all(allElements.map(async (element) => {
    // Check if the element has exactly one child with data-review-id
    const childElements = await findElementsByXPath(element, ".//div[@data-review-id]");
    
    if (childElements.length === 1) {
      // Fetch data-review-id only when condition is met
      const dataReviewId = await element.getAttribute("data-review-id");
      filteredReviews.push({ dataReviewId, element });
    }
  }));

  return filteredReviews;
}

async function extractImageUrlsFromButtons(element, driver) {
  const extractedImageUrls = [];
  const allButtons = await findElementsByXPath(element, ".//button");
  const attributesToExtract = ['jsaction', 'style'];

  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'style': style } = await getElementAttributes(driver, button, attributesToExtract);
    if (jsaction && jsaction.includes('review.openPhoto')) {
      let imageUrl = style.split('url("')[1]?.split('");')[0];

      if (imageUrl) {
        imageUrl = imageUrl.split('=')[0] + '=w1200';
        extractedImageUrls.push(imageUrl);
      }
    }
  }

  return extractedImageUrls;
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

async function extractReviewText(element) {
  let reviewText = await element.getText();
  const reviewTextArray = reviewText.split('\n');

  let myendText = "";

  let reviewMyened = await element.findElements(By.className("MyEned"));
  if (reviewMyened.length > 0) {
    const reviewMyenedFirstChild = await reviewMyened[0].findElement(By.xpath("*"));
    myendText = await reviewMyenedFirstChild.getText();
  }

  return extractReviewTextInner(reviewTextArray, myendText);
}

module.exports = { 
  openOverviewTab,
  openReviewTab,
  reviewTabParentElement,
  scrollToBottom,
  clickShowMorePhotosButton,
  clickExpandReviewButtons,
  clickShowReviewInOriginalButtons,
  clickExpandOwnerResponseButtons,
  clickShowOwnerResponseInOriginalButtons,
  filterSingleChildReviews,

  extractImageUrlsFromButtons,
  extractReviewText,

  lastChildInsideParent,
  beforeTheLastChildInsideParentChildren,
  getAllAfterElementTillEnd
};
