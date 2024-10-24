const { startContainer, stopAndRemoveContainer } = require("./dockerUtils");
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

exports.openWebsite = async (url, containerName, generatedPort, subPort, uniqueId) => {
  console.log('Opening website:', url);

  try {
    await startContainer(containerName, generatedPort, subPort, 'custom-selenium-firefox:latest');
    const driver = new Builder()
      .usingServer(`http://localhost:${generatedPort}/wd/hub`)
      .forBrowser('firefox')
      .build();
    
    await driver.get(url);
    const title = await driver.getTitle();
    console.log('Page title:', title);

    await firestore.doc(
      `users/G9PSHlQo4Fo4fXYHZlqflPA6ClBl/reviews/${uniqueId}`
    ).update({ status: 'started', title });

    await openOverviewTab(driver);
    await openReviewTab(driver);

    const parentElm = await reviewTabParentElement(driver);

    if (!parentElm) {
      console.log('Parent element not found');
      throw new Error('Parent element not found');
    }

    await scrollToBottom(driver, parentElm);

    await firestore.doc(
      `users/G9PSHlQo4Fo4fXYHZlqflPA6ClBl/reviews/${uniqueId}`
    ).update({ status: 'processing' });
    await clickShowMorePhotosButton(driver);
    await clickExpandReviewButtons(driver);
    await clickShowReviewInOriginalButtons(driver);
    await clickExpandOwnerResponseButtons(driver);
    await clickShowOwnerResponseInOriginalButtons(driver);
    await firestore.doc(
      `users/G9PSHlQo4Fo4fXYHZlqflPA6ClBl/reviews/${uniqueId}`
    ).update({ status: 'finilizing' });

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

    await firestore.doc(
      `users/G9PSHlQo4Fo4fXYHZlqflPA6ClBl/reviews/${uniqueId}`
    ).update({ status: 'completed', totalMessages: messages.length, completedAt: new Date() });

    return messages;
  } catch (error) {
    stopAndRemoveContainer(containerName, uniqueId);
    console.error('Failed to start container:', error);
  }
}
