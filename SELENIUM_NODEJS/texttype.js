const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reviews', 'httpsmapsappgooglBU6QMyYeP3e6j2Mv7.json');
const data = fs.readFileSync(filePath, 'utf-8');
let reviews = JSON.parse(data);

reviews = reviews.splice(20, 40); // Extract only 3 reviews for testing
// const reviewTextArray = reviews[2]['reviewTextArray'];

const extracted = {
  user: "",
  rate: "",
  time: "",
  platform: "",
  review: "",
  response: "",
}

console.log(reviews.length);

function extractReviewText(reviewTextArray) {
  let user = reviewTextArray[0];
  let userInformation = reviewTextArray[1];
  let rate = reviewTextArray.find(text => text.includes("/5"));
  let time = "";
  let platform = 'Google';
  let response = "";
  let responseTime = "";


  let reviewText = "";
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
    if(reviewTextArray[startIndex].toLowerCase() === "new") { // Skip the 'new' if it exists
      startIndex += 1;
    }
    reviewText = reviewTextArray.slice(startIndex, endIndex).join(" ").trim();

    // remove non-ascii characters
    // reviewText = reviewText.replace(/[^\x00-\x7F]/g, "");

    // remove the last words till it is alphabetic
    // let lastWord = reviewText.split(" ").pop();
    // while (!lastWord.match(/^[a-z]+$/i)) {
    //   reviewText = reviewText.replace(lastWord, "").trim();
    //   lastWord = reviewText.split(" ").pop();
    // }

    // remove See translation (English) if it exists
    reviewText = reviewText.replace('See translation (English)', '');

    // remove more than one space
    reviewText = reviewText.replace(/\s{2,}/g, ' ');

    // remove the last numbers
    reviewText = reviewText.replace(/\d+$/g, "");

    // remove this 
    reviewText = reviewText.replace(//g, "");


    // remove end spaces
    reviewText = reviewText.trim();
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
  }

  return {
    user,
    userInformation,
    rate,
    time,
    platform,
    reviewText,
    response,
    responseTime,
  }
}

reviews.forEach(review => {
  console.log('--'.repeat(20));
  const reviewTextArray = review['reviewTextArray'];
  const reviewText = extractReviewText(reviewTextArray);
  console.log(reviewText);
});
