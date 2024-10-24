async function execPromise(command) {
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

async function startContainer(
  containerName,
  generatedPort,
  subPort,
  imageName
) {
  const command = `docker run -d --name ${ containerName } -p ${ generatedPort }:4444 -p ${subPort}:7900 --shm-size="2g" ${ imageName }`;
  try {
    const result = await execPromise(command);
    console.log(`Docker container started: ${result}`);
  } catch (error) {
    console.error(error);
  }
}

async function stopContainer(
  containerName,
  uniqueId
) {
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

export const openWebsite = async (url) => {
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
          let imageUrl = style.split('url("')[1].split('");')[0];
          imageUrl = imageUrl.split('=')[0] + '=w1200';
          extractedImageUrls.push(imageUrl);
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