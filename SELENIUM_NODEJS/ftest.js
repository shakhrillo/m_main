const path = require('path');

const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'map-review-scrap',
  keyFilename: path.join(__dirname, 'keys.json')
});

// set emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
firestore.settings({
  host: 'localhost:8080',
  ssl: false
});

async function createDocument(content) {
  const docRef = firestore.collection('tests').doc();
  await docRef.set(content);
  return docRef.id;
}

createDocument({ name: 'test' }).then(id => {
  console.log(`Document created with ID: ${id}`);
});

console.log('Done');