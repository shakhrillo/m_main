const admin = require('firebase-admin');
const path = require('path')

const serviceAccountPath = path.resolve(__dirname, './serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

if (process.env.NODE_ENV === 'development') {
  admin.firestore().settings({
    host: 'localhost:8282',
    ssl: false
  });
}

const firestore = admin.firestore();

const auth = admin.auth();
module.exports = { admin, firestore, auth };