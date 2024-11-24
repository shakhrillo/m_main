const admin = require("firebase-admin");

const userCreate = async ({ uid, email, displayName }) => {
  await admin
    .firestore()
    .batch()
    .set(admin.firestore().collection("users").doc(uid), {
      email,
      displayName,
      coins: 0,
    })
    .commit();
};

module.exports = userCreate;
