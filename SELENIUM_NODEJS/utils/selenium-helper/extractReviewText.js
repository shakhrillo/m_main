const { By } = require('selenium-webdriver');

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

module.exports = extractReviewText;