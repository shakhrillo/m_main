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
  extractReviewText
} = require("./seleniumUtils");
const { Builder } = require('selenium-webdriver');

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
    const driver = new Builder()
      .usingServer(`http://localhost:${generatedPort}/wd/hub`)
      .forBrowser('firefox')
      .build();
    
    await driver.get(url);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    await updateReviewStatus(uid, reviewId, { status: 'started', title });

    await openOverviewTab(driver);
    await openReviewTab(driver);

    const parentElm = await reviewTabParentElement(driver);

    if (!parentElm) {
      console.log('Parent element not found');
      throw new Error('Parent element not found');
    }

    await updateReviewStatus(uid, reviewId, { status: 'processing' });
    
    const filteredReviews = await scrollToBottom(driver, parentElm);
    // await clickShowMorePhotosButton(driver);
    // await clickExpandReviewButtons(driver);
    // await clickShowReviewInOriginalButtons(driver);
    // await clickExpandOwnerResponseButtons(driver);
    // await clickShowOwnerResponseInOriginalButtons(driver);
    // const filteredReviews = await filterSingleChildReviews(driver);
    
    await updateReviewStatus(uid, reviewId, { status: 'finalizing' });

    console.log('Filtered reviews>>>>>', filteredReviews.size);
    
    const messages = await Promise.all(
      filteredReviews.forEach(async (filteredReview) => {
        const element = filteredReview.element;
        const message = {
          ...(await extractReviewText(element)),
          imageUrls: await extractImageUrlsFromButtons(element),
        };
    
        // Call the addMessageToReview function concurrently
        await addMessageToReview(uid, reviewId, message);
        return message; // Return the message to include it in the messages array
      })
    );    

    await updateReviewStatus(uid, reviewId, {
      status: 'completed',
      totalMessages: messages.length,
      completedAt: new Date()
    });

    stopAndRemoveContainer(containerName);

    return messages;
  } catch (error) {
    stopAndRemoveContainer(containerName);
    console.error('Failed to start container:', error);
  }
}
