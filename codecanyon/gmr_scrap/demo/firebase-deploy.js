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
const auth = admin.auth();

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
  
  ["users", "earnings", "info", "comments"].forEach((type) => {
    const documentRef = firestore.collection('statistics').doc(type);
    batch.set(documentRef, {
      total: 0,
    });
  });

  await batch.commit();

  // Get all users and remove them
  const { users } = await auth.listUsers();
  await auth.deleteUsers(users.map((user) => user.uid));

  console.log('✅ Completed importing initial data.');
};

importInitialData();
