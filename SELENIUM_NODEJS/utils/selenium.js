const { startContainer, stopAndRemoveContainer } = require("./dockerUtils");
const { updateReviewStatus } = require("./firestoreUtils");
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
const firestore = require('../firebase/main').firestore;

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

    await scrollToBottom(driver, parentElm);

    await updateReviewStatus(uid, reviewId, { status: 'processing' });

    await clickShowMorePhotosButton(driver);
    await clickExpandReviewButtons(driver);
    await clickShowReviewInOriginalButtons(driver);
    await clickExpandOwnerResponseButtons(driver);
    await clickShowOwnerResponseInOriginalButtons(driver);
    
    await updateReviewStatus(uid, reviewId, { status: 'finalizing' });

    const filteredReviews = await filterSingleChildReviews(driver);
    console.log('Filtered reviews:', filteredReviews.length);
    
    const messages = [];
    for (const element of filteredReviews) {
      const message = {
        imageUrls: [],
        review: {}
      }

      message.imageUrls = await extractImageUrlsFromButtons(element);
      message.review = await extractReviewText(element);
      messages.push(message);
      await firestore.collection(
        `users/G9PSHlQo4Fo4fXYHZlqflPA6ClBl/reviews/${uniqueId}/messages`
      ).add(message)
    }

    await updateReviewStatus(uid, reviewId, {
      status: 'completed',
      totalMessages: messages.length,
      completedAt: new Date()
    });

    return messages;
  } catch (error) {
    stopAndRemoveContainer(containerName, uniqueId);
    console.error('Failed to start container:', error);
  }
}
