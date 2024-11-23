const admin = require("firebase-admin");

async function userCreate(user) {
  const db = admin.firestore();
  const batch = db.batch();
  const userRef = db.collection("users").doc(user.uid);
  batch.set(userRef, {
    email: user.email,
    displayName: user.displayName,
    coins: 0,
  });
  await batch.commit();
}

module.exports = userCreate;
