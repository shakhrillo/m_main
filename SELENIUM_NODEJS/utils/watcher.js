const { openWebsite } = require('./selenium');
const firestore = require('../firebase/main').firestore;

try {
  console.log('--'.repeat(20));
  console.log('Watching for new reviews...');

  let firstBatchSkipped = false;

  firestore.collection('users')
    .doc('G9PSHlQo4Fo4fXYHZlqflPA6ClBl')
    .collection('reviews')
    .onSnapshot((snapshot) => {
      if (!firstBatchSkipped) {
        firstBatchSkipped = true;
        return; // Skip the first snapshot
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          console.log('data:', data);

          openWebsite(data.url, data.container.name, data.container.port, data.container.subPort, change.doc.id);
        }
      });
    });

} catch (err) {
  console.error('Error initializing Firebase:', err);
}