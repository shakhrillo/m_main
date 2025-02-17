const admin = require('firebase-admin');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const APP_ENVIRONMENT = process.env.APP_ENVIRONMENT;
const APP_FIREBASE_PROJECT_ID = process.env.APP_FIREBASE_PROJECT_ID;
const GOOGLE_APPLICATION_CREDENTIALS = '/usr/src/app/firebaseServiceAccount.json';
const INITIAL_DATA_PATH = '/usr/src/app/initial-data.json';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  projectId: APP_FIREBASE_PROJECT_ID,
});

const firestore = admin.firestore();

// Function to run Firebase CLI commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to delete all Firestore collections
async function deleteFirestoreCollections() {
  const collections = await firestore.listCollections();
  for (const collection of collections) {
    const documents = await collection.get();
    const batch = firestore.batch();
    documents.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted all documents from collection: ${collection.id}`);
  }
}

// Function to import initial data
async function importInitialData() {
  if (fs.existsSync(INITIAL_DATA_PATH)) {
    const initialData = require(INITIAL_DATA_PATH);
    const batch = firestore.batch();

    console.log(`data: ${initialData}`);


    initialData.forEach((data) => {
      const collectionRef = firestore.collection(data.collection);
      batch.set(collectionRef, data.data);
    });

    await batch.commit();
    console.log('Initial data imported.');
  } else {
    console.error('Initial data file not found.');
  }
}

// Main deploy function
async function deploy() {
  try {
    if (APP_ENVIRONMENT === 'production') {
      // Remove package-lock.json if it exists
      const packageLockPath = '/usr/src/app/functions/package-lock.json';
      if (fs.existsSync(packageLockPath)) {
        fs.unlinkSync(packageLockPath);
        console.log('Removed package-lock.json');
      }

      // Delete Firestore collections
      console.log('Deleting Firestore collections...');
      await deleteFirestoreCollections();

      // Clear Firestore indexes
      console.log('Clearing Firestore indexes...');
    //   await runCommand(`firebase firestore:indexes:clear --project "${APP_FIREBASE_PROJECT_ID}"`);

      // Import initial data
      console.log('Importing initial data...');
      await importInitialData();

      // Deploy functions
      console.log('Deploying Firebase functions...');
      await runCommand(`firebase deploy --project "${APP_FIREBASE_PROJECT_ID}"`);

    } else {
      // Start Firebase emulators
      console.log('Starting Firebase emulators...');
      await runCommand(`firebase emulators:start --project "demo-${APP_FIREBASE_PROJECT_ID}" --import=./data --export-on-exit=./data`);
    }

  } catch (error) {
    console.error('Error during deployment:', error);
  }
}

deploy();
