const { startContainer, stopAndRemoveContainer } = require("./dockerUtils");
const { updateReviewStatus, addMessageToReview } = require("./firestoreUtils");
const { 
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
} = require("./seleniumUtils");
const { By, Builder, Capabilities } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');


exports.openWebsite = async (
  url,
  containerName,
  imageName,
  generatedPort,
  subPort,
  reviewId,
  browserName,
  uid
) => {
  console.log('Opening website:', url, browserName);

  try {
    const gcURL = await startContainer(containerName, generatedPort, subPort, imageName);
    console.log('Container started:', gcURL);
    // https://selenium-1730029569461-348810635690.us-central1.run.app
    // {"browserName":"chrome","browserVersion":"132.0","goog:chromeOptions":{"binary":"/usr/bin/google-chrome"},"platformName":"linux","se:containerName":"","se:noVncPort":7900,"se:vncEnabled":true}
    const driver = new Builder()
      .forBrowser(webdriver.Browser.CHROME)
      .usingServer(`${gcURL}/wd/hub`)
      .build();

// gcloud iam service-accounts create selenium-invoker \
//   --description "This service accounts invokes Selenium on Google Cloud Run." 
//   --display-name "Selenium Invoker"

// gcloud run services add-iam-policy-binding selenium-1730030886522 \
//   --member serviceAccount:selenium-invoker@map-review-scrap.iam.gserviceaccount.com \
//   --role roles/run.invoker \
//   --region us-central1

    await driver.get(url);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    await updateReviewStatus(uid, reviewId, { status: 'started', title });

    await openOverviewTab(driver);
    // wait 2 seconds
    await driver.sleep(2000);

    await openReviewTab(driver);
    await driver.sleep(2000);

    // click on sort by newest
    // aria-label="Sort reviews"
    const sortButton = await driver.findElements(By.xpath("//button[@aria-label='Sort reviews']"));
    if (sortButton.length > 0) {
      await sortButton[0].click();
      await driver.sleep(2000);
      // role="menuitemradio"
      const newestButton = await driver.findElements(By.xpath("//div[@role='menuitemradio']"));
      for (const b of newestButton) {
        const text = await b.getText();
        if (text.toLowerCase().includes('newest')) {
          await b.click();
          break;
        }
      }
    }
    
    let { parentElm } = await reviewTabParentElement(driver);
    // const _parentElm = parentElm;
    
    let previousScrollHeight = 0;
    let currentScrollHeight = await driver.executeScript("return arguments[0].scrollHeight;", parentElm);
    const messages = [];
    let lastElementId = null;

    let count = 0;
    let isFullyLoaded = false;

    // while (previousScrollHeight !== currentScrollHeight) {
    while (!isFullyLoaded) {
      console.log('Scrolling to the bottom');
      let { parentElm } = await reviewTabParentElement(driver);
      const { allElements, lastValidElementId, lastChildChildrenLength } = await beforeTheLastChildInsideParentChildren(parentElm, lastElementId);
      console.log('Elements:', allElements.length);
      console.log('Last element id:', lastValidElementId);
      lastElementId = lastValidElementId;

      for (const e of allElements) {
        // if (!element) {
        //   continue;
        // }

        // const _children = await element.findElements(By.xpath("child::*"));

        // if (_children.length === 0) {
        //   continue;
        // }

        const message = {
          ...(await extractReviewText(e.element)),
          imageUrls: await extractImageUrlsFromButtons(e.element, driver),
          id: e.id
        };

        // if (!message.id) {
          // console.log('Review id not found');
        //   continue;
        // }

        // if (messages.find(m => m.id === message.id)) {
        //   // console.log('Review already exists');
        //   continue;
        // }

        console.log('Processing review:', count);
        messages.push(message);
        await addMessageToReview(uid, reviewId, message);
        count++;
      }

      // Scroll to the bottom
      await driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight;", parentElm);
      // Wait for content to load
      // await driver.sleep(2500);

      // Update scroll heights
      previousScrollHeight = currentScrollHeight;
      currentScrollHeight = await driver.executeScript("return arguments[0].scrollHeight;", parentElm);
      // currentScrollHeight += lastChildChildrenLength;

      console.log('Last child:', lastChildChildrenLength);
      
      if (lastChildChildrenLength === 0) {
        isFullyLoaded = true;
        console.log('Reached the end, scroll height has not changed');
        break;
      }
    }

    console.log('Scrolling to the bottom completed');


    if (!parentElm) {
      console.log('Parent element not found');
      throw new Error('Parent element not found');
    }

    console.log('Messages:', messages.length);
    await updateReviewStatus(uid, reviewId, {
      status: 'completed',
      totalMessages: messages.length,
      completedAt: new Date()
    });

    stopAndRemoveContainer(containerName);

    return [];
  } catch (error) {
    stopAndRemoveContainer(containerName);
    console.error('Failed to start container:', error);
  }
}
