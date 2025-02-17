const admin = require('firebase-admin');
const fs = require('fs');
const APP_FIREBASE_PROJECT_ID = process.env.APP_FIREBASE_PROJECT_ID;
const GOOGLE_APPLICATION_CREDENTIALS = '/usr/src/app/firebaseServiceAccount.json';
const INITIAL_DATA_PATH = '/usr/src/app/initial-data.json';

admin.initializeApp({
  credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  projectId: APP_FIREBASE_PROJECT_ID,
});

const firestore = admin.firestore();


(async () => {
  if (fs.existsSync(INITIAL_DATA_PATH)) {
    const initialData = require(INITIAL_DATA_PATH);
    const batch = firestore.batch();
    
    initialData.forEach((data) => {
      const collectionRef = firestore.collection(data.collection).doc(data.documentId);
      batch.set(collectionRef, data.data);
    });

    await batch.commit();
    console.log('Initial data imported.');
  } else {
    console.error('Initial data file not found.');
  }
})();