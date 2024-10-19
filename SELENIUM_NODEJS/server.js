const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;
const { exec } = require('child_process');
const { Storage } = require('@google-cloud/storage');


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// const firebase = require('firebase/app');
// require('firebase/analytics');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAbWEKCv0vFuretjZhtxrrXBHKgTOy-7cE",
//   authDomain: "map-review-scrap.firebaseapp.com",
//   projectId: "map-review-scrap",
//   storageBucket: "map-review-scrap.appspot.com",
//   messagingSenderId: "406001897389",
//   appId: "1:406001897389:web:bcf2d6fd7ea1b69c749b24",
//   measurementId: "G-YJ9H91CHK1"
// };

// Initialize Firebase
// const fapp = firebase.initializeApp(firebaseConfig);
// const analyticsInstance = firebase.analytics();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  next();
});

function extractReviewText(reviewTextArray, myendText) {
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

  // myendText

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
  }
}

function extractLatLng(url) {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(regex);
  if (match) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return { latitude, longitude };
  } else {
    return { latitude: 0, longitude: 0 };
  }
}

function changeLanguageToEnglish(url) {
  if (!url) {
    return url;
  }

  const urlObj = new URL(url);
  if (urlObj.searchParams.has('hl')) {
    urlObj.searchParams.set('hl', 'en');
    return urlObj.toString();
  } else {
    return `${url}&hl=en`;
  }
}

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'map-review-scrap',
  keyFilename: path.join(__dirname, 'keys.json')
});

async function createDocument(content) {
  const docRef = firestore.collection('reviews').doc();
  await docRef.set(content);
  return docRef.id;
}

async function setDocument(id, content) {
  const docRef = firestore.collection('reviews').doc(id);
  await docRef.set(content);
}

async function getDocument(id) {
  const docRef = firestore.collection('reviews').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return null;
  }
  return doc.data();
}

async function updateDocument(id, content) {
  const docRef = firestore.collection('reviews').doc(id);
  await docRef.update(content);
}

async function addDocumentReview(id, content) {
  const docCollection = firestore.collection(`reviews/${id}/reviews`)
  await docCollection.add(content);
}


const openWebsite = async (url) => {
  url = decodeURIComponent(url);
  console.log('Opening website:', url);

  // const uniqueId = url.replace(/[^a-zA-Z0-9]/g, '');

  // setDocument(uniqueId, {
  //   url,
  //   status: 'started',
  //   createdAt: new Date().toISOString()
  // });

  const uniqueId = await createDocument({
    url,
    status: 'started',
    createdAt: new Date().toISOString()
  });

  const generatedPort = Math.floor(Math.random() * 10000) + 10000;
  const subPort = generatedPort + 1;
  const imageName = `selenium/standalone-firefox:4.25.0-20241010`;
  const containerName = `selenium-${Date.now()}`;
  // const command = `docker run -d -p ${generatedPort}:4444 -p 7900:7900 --shm-size="2g" --name ${containerName} ${imageName}`;

  function execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        } else if (stderr) {
          reject(`Error: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  async function startContainer() {
    const command = `docker run -d --name ${ containerName } -p ${ generatedPort }:4444 -p ${subPort}:7900 --shm-size="2g" ${ imageName }`;
    try {
      const result = await execPromise(command);
      console.log(`Docker container started: ${result}`);
    } catch (error) {
      console.error(error);
    }
  }

  // Function to stop the Docker container
  async function stopContainer() {
    const command = `docker stop ${containerName} && docker rm ${containerName}`;
    try {
      await updateDocument(uniqueId, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      const result = await execPromise(command);
      console.log(`Docker container stopped and removed: ${result}`);
    } catch (error) {
      console.error(error);
    }
  }

  // Start the Docker container
  await startContainer();

  // wait for the container to start
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('Docker container started');

  const driver = new Builder()
    .usingServer(`http://localhost:${generatedPort}/wd/hub`)
    .forBrowser('firefox') // Change to 'firefox' if using Firefox
    .build();
  
  try {
    
    const imagesDir = path.join(__dirname, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const info = {};
    console.log('Getting URL:', url);
    await driver.get(url);
    console.log('Got URL:', url);

    const title = await driver.getTitle();
    console.log('Title:', title);

    const allButtons = await driver.findElements(By.xpath("//button[@role='tab']"));

    console.log('All buttons:', allButtons.length);

    for (const button of allButtons) {
      const dataTabIndex = await button.getAttribute('data-tab-index');
      const areaSelected = await button.getAttribute('aria-selected');
      if (dataTabIndex === '0' && areaSelected === 'false') {
        console.log('Opening overview tab');
        await button.click();
        await driver.sleep(2000);
        break;
      } else {
        console.log('Already overview tab is selected');
      }
    }

    const roleMainDiv = await driver.findElement(By.xpath("//div[@role='main']"));
    info.mainTitle = await roleMainDiv.findElement(By.xpath(".//h1")).getText();
    info.mainSubtitle = await roleMainDiv.findElement(By.xpath(".//h2")).getText();
    const mainReviews = await roleMainDiv.findElements(By.xpath(".//span[@aria-label]"));
    for (const review of mainReviews) {
      const ariaLabel = await review.getAttribute('aria-label');
      const role = await review.getAttribute('role');
      if(ariaLabel.includes('stars') && role === 'img') {
        info.mainRate = ariaLabel;
      }

      if (ariaLabel.includes('reviews')) {
        info.mainReview = await review.getText();
        break;
      }
    }

    const currentUrl = await driver.getCurrentUrl();
    info.address = {
      'name': '',
      ...extractLatLng(currentUrl)
    }
    const addressButton = await driver.findElement(By.xpath("//button[@data-item-id='address']"));
    if (addressButton) {
      info.address.name = await addressButton.getAttribute('aria-label');
    }

    await updateDocument(uniqueId, {
      status: 'in-progress',
      info
    });

    console.log('Info:', info);

    for (const button of allButtons) {
      const tabText = await button.getText();
      if (tabText.toLowerCase().includes('reviews')) {
        console.log('Opening review tab');
        await button.click();
        await driver.sleep(2000);
        break;
      } else {
        console.log('Already review tab is selected');
      }
    }

    let parentElm = null;
    const vyucnb = await driver.findElements(By.className("vyucnb"));
    if (vyucnb.length > 0) {
      parentElm = await vyucnb[0].findElement(By.xpath("parent::*"));
    }

    if (!parentElm) {
      console.log('Parent element not found');
      // give error for try
      throw new Error('Parent element not found');
    }

    // Scroll to the bottom of the reviews
    let scrollHeight = await parentElm.getAttribute("scrollHeight");
    await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
    await driver.sleep(2000);
    while (true) {
      console.log('Scrolling down');
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", parentElm);
      await driver.sleep(2000);
      const newScrollHeight = await parentElm.getAttribute("scrollHeight");
      if (newScrollHeight === scrollHeight) {
        console.log('Reached the bottom of the reviews');
        break;
      }
      scrollHeight = newScrollHeight;
    }

    // Click on the button to show more photos
    const allButtonsAgain = await driver.findElements(By.xpath("//button"));
    console.log('Clicking on the button to show more photos', allButtonsAgain.length);
    for (const button of allButtonsAgain) {
      const jsaction = await button.getAttribute('jsaction');
      if (jsaction && jsaction.includes('review.showMorePhotos')) {
        await button.click();
        // await driver.sleep(2000);
      }
    }

    // Click on the review more button
    const allReviewMoreButtons = await driver.findElements(By.xpath("//button"));
    console.log('Clicking on the review more button', allReviewMoreButtons.length);
    for (const button of allReviewMoreButtons) {
      const jsaction = await button.getAttribute('jsaction');
      if (jsaction && jsaction.includes('review.expandReview')) {
        await button.click();
        // await driver.sleep(2000);
      }
    }

    // pane.wfvdle1780.review.expandOwnerResponse
    const allOwnerResponseButtons = await driver.findElements(By.xpath("//button"));
    console.log('Clicking on the owner response button', allOwnerResponseButtons.length);
    for (const button of allOwnerResponseButtons) {
      const jsaction = await button.getAttribute('jsaction');
      if (jsaction && jsaction.includes('review.expandOwnerResponse')) {
        await button.click();
      }
    }

    // pane.wfvdle3773.review.showOwnerResponseInOriginal
    const allShowOwnerResponseButtons = await driver.findElements(By.xpath("//button"));
    console.log('Clicking on the show owner response button', allShowOwnerResponseButtons.length);
    for (const button of allShowOwnerResponseButtons) {
      const jsaction = await button.getAttribute('jsaction');
      if (jsaction && jsaction.includes('review.showOwnerResponseInOriginal')) {
        await button.click();
      }
    }

    // Click on the show original button
    const allShowOriginalButtons = await driver.findElements(By.xpath("//button"));
    console.log('Clicking on the show original button', allShowOriginalButtons.length);
    for (const button of allShowOriginalButtons) {
      const jsaction = await button.getAttribute('jsaction');
      const ariaChecked = await button.getAttribute('aria-checked');
      if (jsaction && jsaction.includes('review.showReviewInOriginal') && ariaChecked === 'true') {
        await button.click();
        // await driver.sleep(2000);
      }
    }

    console.log('Filtering reviews');
    const filteredReviews = [];
    const allDataReviewId = await driver.findElements(By.xpath("//div[@data-review-id]"));
    for (const element of allDataReviewId) {
      const childElements = await element.findElements(By.xpath(".//div[@data-review-id]"));
      if (childElements.length === 1) {
        filteredReviews.push(element);
      }
    }

    console.log('Starting to extract reviews');
    const messages = [];
    for (const element of filteredReviews) {
      console.log('Extracting review images');
      // Extract images
      const extractedImageUrls = [];
      const savedImages = [];
      const buttons = await element.findElements(By.xpath(".//button"));
      for (const button of buttons) {
        const jsaction = await button.getAttribute('jsaction');
        if (jsaction && jsaction.includes('review.openPhoto')) {
          const style = await button.getAttribute('style');
          const imageUrl = style.split('url("')[1].split('");')[0];
          extractedImageUrls.push(imageUrl);
          // await driver.sleep(2000);
        }
      }
      console.log('Extracted image urls:', extractedImageUrls.length);
      // for (const imageUrl of extractedImageUrls) {
      //   const formattedUrl = imageUrl.split('=')[0] + '=w1000';
      //   const response = await axios.get(formattedUrl, { responseType: 'arraybuffer' });
      //   const imageName = `${Date.now()}.png`;
      //   fs.writeFileSync(path.join(imagesDir, imageName), response.data);
      //   savedImages.push(imageName);
      // }

      console.log('Extracting reviewer');
      const reviewer = {};
      const buttonsReviewer = await element.findElements(By.xpath(".//button"));
      for (const button of buttonsReviewer) {
        const jsaction = await button.getAttribute('jsaction');
        const dataHref = await button.getAttribute('data-href');
        if (jsaction && jsaction.includes('review.reviewerLink') && dataHref.includes('maps/contrib')) {
          const childElements = await button.findElements(By.xpath(".//*"));
          
          for (let i = 0; i < childElements.length; i++) {
            const tagName = await childElements[i].getTagName();
            if (tagName === 'img') {
              reviewer.photoUrl = await childElements[i].getAttribute('src');
            }
            if (i === 0 && tagName === 'div') {
              reviewer.name = await childElements[i].getText();
            } else if (i === 1 && tagName === 'div') {
              reviewer.info = await childElements[i].getText();
            }
          }
        }
      }

      console.log('Extracting review text');
      let reviewText = await element.getText();
      const reviewTextArray = reviewText.split('\n');

      let myendText = "";

      let reviewMyened = await element.findElements(By.className("MyEned"));
      if (reviewMyened.length > 0) {
        const reviewMyenedFirstChild = await reviewMyened[0].findElement(By.xpath("*"));
        myendText = await reviewMyenedFirstChild.getText();
      }

      let extractedData = {};
      try {
        extractedData = extractReviewText(reviewTextArray, myendText);
      } catch (error) {
        console.error(`Error in extractReviewText: ${error}`);
      }

      // console.log('Extracting review score');
      // let reviewContent = null;
      // let reviewScore = "";
      // const reviewStars = await element.findElement(By.xpath(".//span[@aria-label]"));
      // if (reviewStars) {
      //   reviewScoreParent = await reviewStars.findElement(By.xpath("parent::*"));
      //   reviewScoreParentNext = await reviewScoreParent.findElement(By.xpath("following-sibling::*"));
      //   if(reviewScoreParentNext) {
      //     reviewContent = await reviewScoreParentNext.getText();
      //     if (reviewContent) {
      //       reviewContent = reviewContent.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      //       // remove reviewText from reviewContent
      //       if(reviewContent.includes(reviewText)) {
      //         reviewContent = reviewContent.replace(reviewText, '');
      //       }
      //     }
      //   }

      //   reviewScore = await reviewStars.getAttribute('aria-label');
      // }

      // let timeAgo = null;
      // if(reviewStars) {
      //   const timeAgoElm = await reviewStars.findElement(By.xpath("following-sibling::span"));
      //   timeAgo = await timeAgoElm.getText();
      // }

      const reviewStars = await element.findElements(By.xpath(".//span[@aria-label]"));
      if (reviewStars.length > 0) {
        const ariaLabel = await reviewStars[0].getAttribute('aria-label');
        const role = await reviewStars[0].getAttribute('role');
        if (ariaLabel.includes(' stars') && role === 'img') {
          extractedData.rate = ariaLabel;
        }
      }

      const message = {
        myendText,
        // reviewText,
        reviewTextArray,
        // content: reviewContent,
        images: extractedImageUrls,
        // timeAgo,
        // reviewScore,
        reviewer,
        ...extractedData
      }

      console.log('Message:', message);

      messages.push(message);
      addDocumentReview(uniqueId, message);
    }

    console.log('Done extracting reviews');

    // create reviews folder if not exists
    const reviewsDir = path.join(__dirname, 'reviews');
    if (!fs.existsSync(reviewsDir)) {
      fs.mkdirSync(reviewsDir);
    }

    // save json locally
    const jsonPath = path.join(__dirname, 'reviews', `${uniqueId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(messages, null, 2));

    // save csv locally
    const csvPath = path.join(__dirname, 'reviews', `${uniqueId}.csv`);
    const csvContent = messages.map((message) => {
      return `${message.reviewText}\n`;
    }).join('\n');
    fs.writeFileSync(csvPath, csvContent);

    // Upload the file to Google Cloud Storage
    const bucketName = 'map-review-scrap.appspot.com';
    const storage = new Storage({
      projectId: 'map-review-scrap',
      keyFilename: path.join(__dirname, 'keys.json')
    });

    const bucket = storage.bucket(bucketName);
    const destination = `reviews/${uniqueId}.json`;
    await bucket.upload(jsonPath, {
      destination
    });

    const destinationCsv = `reviews/${uniqueId}.csv`;
    await bucket.upload(csvPath, {
      destination: destinationCsv
    });

    // Update the document with the file URL
    const [metadata] = await bucket.file(destination).getMetadata();
    const fileUrl = metadata.mediaLink;
    
    const [metadataCsv] = await bucket.file(destinationCsv).getMetadata();
    const fileUrlCsv = metadataCsv.mediaLink;

    await updateDocument(uniqueId, {
      status: 'completed',
      fileUrl: destination,
      fileUrlCsv: destinationCsv
    });

    return {info, messages};
  } catch (error) {
    console.error(`Error in openWebsite: ${error}`);
    stopContainer();
    await driver.quit();
    return {};
  } finally {
    stopContainer();
    await driver.quit();
  }
}

app.get('/review', async (req, res) => {
  // const reviews = await openWebsite("https://www.google.com/maps/place/Xo'jalar+qishloq/@40.0400878,64.3845308,14146m/data=!3m1!1e3!4m8!3m7!1s0x3f507763c71e67b7:0xedc9cda1038a9e14!8m2!3d40.0266191!4d64.3726174!9m1!1b1!16s%2Fg%2F11n08fvk1t?entry=ttu&g_ep=EgoyMDI0MTAwOS4wIKXMDSoASAFQAw%3D%3D")
  // query url
  const queryUrl = req.query.url;
  if (!queryUrl) {
    res.status(400).send({
      message: 'URL is required'
    });
    return;
  }

  const reviews = openWebsite(queryUrl) || [];
  console.log(reviews.length);
  // res.send(reviews);

  res.send({
    message: 'Review extraction started'
  });

});

async function deleteCollection(collectionRef, batchSize = 100) {
  const query = collectionRef.limit(batchSize);
  return new Promise((resolve, reject) => {
      deleteQueryBatch(query, resolve, reject);
  });
}

async function deleteQueryBatch(query, resolve, reject) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
      // When there are no documents left, the operation is complete
      resolve();
      return;
  }

  // Delete documents in a batch
  const batch = firestore.batch();
  snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
  });

  await batch.commit();

  // Recurse on the next process tick, to allow for memory cleanup
  process.nextTick(() => {
      deleteQueryBatch(query, resolve, reject);
  });
}

async function deleteCollectionRecursively(collectionPath) {
  const collectionRef = firestore.collection(collectionPath);

  // Delete top-level documents in the collection
  await deleteCollection(collectionRef);

  // Delete subcollections for each document
  const documentSnapshots = await collectionRef.get();
  const deleteSubcollectionsPromises = [];

  documentSnapshots.forEach(doc => {
    const subcollectionsPromise = doc.ref.listCollections().then(subcollections => {
      const subcollectionDeletes = subcollections.map(subcollection =>
        deleteCollectionRecursively(subcollection.path)
      );
      return Promise.all(subcollectionDeletes);
    });

    deleteSubcollectionsPromises.push(subcollectionsPromise);
  });

  // Wait for all subcollection deletes to finish
  await Promise.all(deleteSubcollectionsPromises);
}

app.delete('/reviews/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: 'ID is required'
    });
    return;
  }

  try {
    // set delete status
    await updateDocument(id, {
      status: 'deleting'
    });
    await deleteCollectionRecursively(`reviews/${id}/reviews`);
    await firestore.collection('reviews').doc(id).delete();
    res.send({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).send({
      message: `Error: ${error}`
    });
  }
});

// app.get('/items/:itemId', (req, res) => {
//   const itemId = req.params.itemId;
//   const query = req.query.q;
//   res.send({
//     itemId,
//     query
//   });
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});