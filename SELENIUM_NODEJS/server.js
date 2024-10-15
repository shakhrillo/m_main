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
//   authDomain: "borderline-dev.firebaseapp.com",
//   projectId: "borderline-dev",
//   storageBucket: "borderline-dev.appspot.com",
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
  next();
});

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
  projectId: 'borderline-dev',
  keyFilename: path.join(__dirname, 'keys.json')
});

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

  const uniqueId = url.replace(/[^a-zA-Z0-9]/g, '');

  setDocument(uniqueId, {
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
      return {};
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
      // let reviewMyened = await element.findElements(By.className("MyEned"));
      // if (reviewMyened.length > 0) {
      //   const reviewMyenedFirstChild = await reviewMyened[0].findElement(By.xpath("*"));
      //   let reviewMyenedText = await reviewMyenedFirstChild.getText();
      //   reviewMyenedText = reviewMyenedText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      //   reviewText = reviewMyenedText;
      // }

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

      const message = {
        reviewText,
        // content: reviewContent,
        images: extractedImageUrls,
        // timeAgo,
        // reviewScore,
        reviewer
      }

      console.log('Message:', message);

      messages.push(message);
      addDocumentReview(uniqueId, message);
    }

    console.log('Done extracting reviews');

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

  const reviews = await openWebsite(queryUrl) || [];
  console.log(reviews.length);
  res.send(reviews);
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