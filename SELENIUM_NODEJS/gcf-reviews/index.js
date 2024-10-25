const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

function setupSeleniumContainer(url) {
  const generatedPort = Math.floor(Math.random() * 10000) + 10000;
  const subPort = generatedPort + 1;
  // const imageName = 'selenium/standalone-firefox:4.25.0-20241010';
  const imageName = 'custom-selenium-firefox:latest';
  const containerName = `selenium-${Date.now()}`;

  return {
    generatedPort,
    subPort,
    imageName,
    containerName,
    url
  };
}

exports.reviewCreated = onDocumentCreated("users/{uid}/reviews/{reviewId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }
  const data = snapshot.data();
  if (!data) {
    console.log("No data associated with the event");
    return;
  }
  const uid = event.params.uid;
  const reviewId = event.params.reviewId;
  const docker = setupSeleniumContainer(data.url);

  await getFirestore().collection(`reviews`).add({
    uid,
    reviewId,
    ...docker,
  });

  console.log(`Review created: ${reviewId}`);
});
