const { By } = require('selenium-webdriver');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function findElementsByXPath(driver, xpath) {
  return await driver.findElements(By.xpath(xpath));
}

async function getElementAttributes(element, attributes) {
  const attributeValues = {};

  for (const attr of attributes) {
    attributeValues[attr] = await element.getAttribute(attr);
  }

  return attributeValues;
}

async function openOverviewTab(driver) {
  const allButtons = await findElementsByXPath(driver, "//button[@role='tab']");
  const attributesToExtract = ['data-tab-index', 'aria-selected'];
  let isOverviewTabSelectedAlready = false;

  for (const button of allButtons) {
    const { 'data-tab-index': dataTabIndex, 'aria-selected': areaSelected } = await getElementAttributes(button, attributesToExtract);
    
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

  return parentElm;
}

async function scrollToBottom(driver, parentElm) {
  let allFilteredReviews = [];
  let previousScrollHeight = await parentElm.getAttribute("scrollHeight");
  const startedTime = new Date().getTime();
  console.log('Scrolling to bottom of the page');

  await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);

  while (true) {
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);

    // Optional: Add small delay to simulate human interaction
    // await driver.sleep(getRandomNumber(200, 800));

    await clickShowMorePhotosButton(driver);
    await clickExpandReviewButtons(driver);
    await clickShowReviewInOriginalButtons(driver);
    await clickExpandOwnerResponseButtons(driver);
    await clickShowOwnerResponseInOriginalButtons(driver);

    const filteredReviews = await filterSingleChildReviews(driver);
    allFilteredReviews.push(...filteredReviews);
    allFilteredReviews = allFilteredReviews.filter((review, index, self) =>
      index === self.findIndex((t) => (
        t.dataReviewId === review.dataReviewId
      ))
    );
    
    console.log('Filtered reviews:', allFilteredReviews.length);

    const currentScrollHeight = await parentElm.getAttribute("scrollHeight");
    console.log('Current & Pre', currentScrollHeight, '=', previousScrollHeight);

    if (currentScrollHeight === previousScrollHeight) {
      const endedTime = new Date().getTime();
      console.log('Time taken to scroll to bottom:', (endedTime - startedTime) / 1000, 'seconds');
      break;  // Break the loop when scrollHeight doesn't change
    }
    
    previousScrollHeight = currentScrollHeight;
  }

  return allFilteredReviews;  // Return after loop finishes
}


async function clickShowMorePhotosButton(driver) {
  const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction'];
  const startedTime = new Date().getTime();
  
  console.log('Clicking all buttons to show more photos');
  for (const button of allButtons) {
    const { 'jsaction': jsaction } = await getElementAttributes(button, attributesToExtract);
    if (jsaction && jsaction.includes('review.showMorePhotos')) {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickExpandReviewButtons(driver) {
  const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-expanded'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to expand reviews');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-expanded': ariaExpanded } = await getElementAttributes(button, attributesToExtract);
    if (jsaction && jsaction.includes('review.expandReview') && ariaExpanded === 'false') {
      await button.click();
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickShowReviewInOriginalButtons(driver) {
  const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-checked'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to show original reviews');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-checked': ariaChecked } = await getElementAttributes(button, attributesToExtract);
    if (jsaction && jsaction.includes('review.showReviewInOriginal') && ariaChecked === 'true') {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickExpandOwnerResponseButtons(driver) {
  const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction', 'aria-expanded'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to expand owner responses');
  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'aria-expanded': ariaExpanded } = await getElementAttributes(button, attributesToExtract);
    if (jsaction && jsaction.includes('review.expandOwnerResponse') && ariaExpanded === 'false') {
      await button.click();
      // await driver.sleep(getRandomNumber(40, 80));
    }
  }

  const endedTime = new Date().getTime();
  console.log('Time taken to click all buttons:', (endedTime - startedTime) / 1000, 'seconds');
}

async function clickShowOwnerResponseInOriginalButtons(driver) {
  const allButtons = await findElementsByXPath(driver, "//button");
  const attributesToExtract = ['jsaction'];
  const startedTime = new Date().getTime();

  console.log('Clicking all buttons to show owner responses');
  for (const button of allButtons) {
    const { 'jsaction': jsaction } = await getElementAttributes(button, attributesToExtract);
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
  const allElements = await findElementsByXPath(driver, "//div[@data-review-id]");

  for (const element of allElements) {
    const childElements = await findElementsByXPath(element, ".//div[@data-review-id]");
    const dataReviewId = await element.getAttribute("data-review-id");
    
    if (childElements.length === 1) {
      filteredReviews.push({
        dataReviewId,
        element,
      });
    }
  }

  return filteredReviews;
}

async function extractImageUrlsFromButtons(element) {
  const extractedImageUrls = [];
  const allButtons = await findElementsByXPath(element, ".//button");
  const attributesToExtract = ['jsaction', 'style'];

  for (const button of allButtons) {
    const { 'jsaction': jsaction, 'style': style } = await getElementAttributes(button, attributesToExtract);
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
    user,
    userInformation,
    rate: rate ? rate : "",
    time,
    platform,
    reviewText,
    response,
    responseTime,
    myendText
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
  extractReviewText
};
