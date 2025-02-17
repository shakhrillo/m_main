const admin = require('firebase-admin');
const fs = require('fs');

const FIREBASE_PROJECT_ID = process.env.APP_FIREBASE_PROJECT_ID;
const FIREBASE_CREDENTIALS_PATH = '/usr/src/app/firebaseServiceAccount.json';
const INITIAL_DATA_FILE_PATH = '/usr/src/app/initial-data.json';

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CREDENTIALS_PATH),
  projectId: FIREBASE_PROJECT_ID,
});

const firestore = admin.firestore();

const importInitialData = async () => {
  if (!fs.existsSync(INITIAL_DATA_FILE_PATH)) {
    console.error('Error: Initial data file not found.');
    return;
  }

  const initialData = require(INITIAL_DATA_FILE_PATH);
  const batch = firestore.batch();

  initialData.forEach((data) => {
    const fields = data.fields;
    const type = data.type;
    fields.forEach((field) => {
      const documentRef = firestore.collection('settings').doc();
      batch.set(documentRef, {
        ...field,
        type,
      });
    });
  });

  await batch.commit();
  console.log('✅ Initial data import successful.');
};

importInitialData();
