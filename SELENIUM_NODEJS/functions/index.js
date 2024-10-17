/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.createUserDetails = functions.auth.user().onCreate(async (user) => {
  // Extract user information
  const { uid, email, displayName } = user;

  // Define initial user details
  const userDetails = {
    name: displayName || "Anonymous",
    email: email,
    balance: 0, // initial balance
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    // Store user details in Firestore
    await admin.firestore().collection("users").doc(uid).set(userDetails);
    console.log("User details created successfully:", uid);
  } catch (error) {
    console.error("Error creating user details:", error);
  }
});

// Delete user details when a user is deleted
exports.deleteUserDetails = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;

  try {
    // Delete user details from Firestore
    await admin.firestore().collection("users").doc(uid).delete();
    console.log("User details deleted successfully:", uid);
  } catch (error) {
    console.error("Error deleting user details:", error);
  }
});

