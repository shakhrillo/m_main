/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
*
* See a full list of supported triggers at https://firebase.google.com/docs/functions
*/

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onDocumentWritten, onDocumentCreated} = require("firebase-functions/v2/firestore");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// `users/${uid}/reviews`
exports.reviewCreated = onDocumentCreated("users/{uid}/reviews/{reviewId}", async (event) => {
  // update created time
  // const review = event.data();
  logger.info("Review created", event);

});
