const wait = require('../utils/wait');
const { launchBrowser, openPage } = require('../utils/browser');
const { clickReviewTab, scrollAndCollectElements } = require('../utils/elementUtils');
const filterUniqueElements = require('../utils/filter');
const { waitTime } = require('../config/settings');

const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'map-review-scrap'
});

async function batchWriteLargeArray(collectionRef, data) {
  const batch = firestore.batch();
  const chunkSize = 500;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    chunk.forEach((doc) => {
      const docRef = collectionRef.doc(doc.id);
      batch.set(docRef, doc);
    });

    await batch.commit();
  }
}

async function main(url, uid, pushId) {
  const browser = await launchBrowser();
  const page = await openPage(browser, url);
  
  await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
    title: await page.title(),
    createdAt: new Date(),
    status: 'in-progress'
  });

  await wait(waitTime);
  await clickReviewTab(page);
  await wait(waitTime);
  const allElements = await scrollAndCollectElements(page);
  const uniqueElements = filterUniqueElements(allElements);

  console.log('Unique elements:', uniqueElements.length);
  console.log('All elements:', allElements.length);
  if (uniqueElements.length > 0) {
    console.log('First text:', uniqueElements[0].textContent);
  }

  await browser.close();

  let collectionReviews = firestore.collection(`users/${uid}/reviews/${pushId}/reviews`);
  const messages = allElements.map((element) => {
    return {
      id: element.id || '',
      text: element.text || '',
      textContent: element.textContent || '',
    };
  });
  await batchWriteLargeArray(collectionReviews, messages);

  await firestore.doc(`users/${uid}/reviews/${pushId}`).update({
    status: 'completed',
    totalReviews: uniqueElements.length,
    completedAt: new Date()
  });

  return uniqueElements;
}

// Export the main function for Google Cloud Functions
module.exports = main;
