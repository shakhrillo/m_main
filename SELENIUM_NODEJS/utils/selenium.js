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
const { By, Builder } = require('selenium-webdriver');


exports.openWebsite = async (
  url,
  containerName,
  imageName,
  generatedPort,
  subPort,
  reviewId,
  uid
) => {
  console.log('Opening website:', url);

  try {
    await startContainer(containerName, generatedPort, subPort, imageName);
    console.log('Container started:', containerName);
    console.log(`http://localhost:${generatedPort}/wd/hub`)
    const driver = new Builder()
      .usingServer(`http://localhost:${generatedPort}/wd/hub`)
      .forBrowser('MicrosoftEdge')
      .build();

    await driver.get(url);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    await updateReviewStatus(uid, reviewId, { status: 'started', title });

    await openOverviewTab(driver);
    await openReviewTab(driver);

    
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
