const { openWebsite } = require('./selenium');
const firestore = require('../firebase/main').firestore;

try {
  let firstBatchSkipped = false;
  firestore.collection('reviews')
    .onSnapshot((snapshot) => {
      if (!firstBatchSkipped) {
        firstBatchSkipped = true;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          console.log('Starting website:', data.url);

          openWebsite(
            data.url, 
            data.containerName,
            data.imageName,
            data.generatedPort,
            data.subPort,
            data.reviewId,
            data.browserName,
            data.uid
          );
        }
      });
    });

} catch (err) {
  console.error('Error initializing Firebase:', err);
}