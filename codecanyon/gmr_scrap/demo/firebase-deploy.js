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

// Delete all documents in a collection
async function deleteCollection(collectionPath) {
  const collectionRef = firestore.collection(collectionPath);
  const snapshot = await collectionRef.get();

  if (snapshot.empty) {
    console.log(`No documents found in ${collectionPath}`);
    return;
  }

  const batch = firestore.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  console.log(`Deleted collection: ${collectionPath}`);

  // Recursively delete subcollections
  for (const doc of snapshot.docs) {
    const subcollections = await doc.ref.listCollections();
    for (const subcollection of subcollections) {
      await deleteCollection(`${collectionPath}/${doc.id}/${subcollection.id}`);
    }
  }
}

// Create admin user
async function createAdminUser() {
  const email = process.env.APP_ADMIN_EMAIL;
  const password = process.env.APP_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Error: Admin email or password not found.');
    return;
  }

  try {
    const user = await auth.createUser({
      email,
      password,
      displayName: 'Admin',
    });

    await firestore.collection('admin').doc(user.uid).set({
      isAdmin: true,
      isEditor: false,
    });
    console.log('✅ Admin user created.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Create demo user
async function createDemoUser() {
  const email = process.env.APP_DEMO_EMAIL;
  const password = process.env.APP_DEMO_PASSWORD;

  if (!email || !password) {
    console.error('Error: Demo email or password not found.');
    return;
  }

  try {
    await auth.createUser({
      email,
      password,
      displayName: 'Demo',
    });
    console.log('✅ Demo user created.');
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
}

// Remove all collections in firestore
async function deleteAllCollections() {
  const collections = await firestore.listCollections();
  for (const collection of collections) {
    await deleteCollection(collection.id);
  }
  console.log('All collections deleted!');
}

const importInitialData = async () => {
  if (!fs.existsSync(INITIAL_DATA_FILE_PATH)) {
    console.error('Error: Initial data file not found.');
    return;
  }

  // Get all users and remove them
  const { users } = await auth.listUsers();
  await auth.deleteUsers(users.map((user) => user.uid));

  // Remove all collections
  await deleteAllCollections();

  // Create admin and demo users
  await createAdminUser();
  await createDemoUser();

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
      total: type === 'users' ? 2 : 0,
    });
  });

  await batch.commit();

  console.log('✅ Completed importing initial data.');
};

importInitialData();
