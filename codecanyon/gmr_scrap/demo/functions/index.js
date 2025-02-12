const fs = require("fs");
const path = require("path");
// require("dotenv").config({
//   path: path.join(__dirname, "../.env"),
// });
require("dotenv").config();

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const { Timestamp, GeoPoint } = require("firebase-admin/firestore");
const processBuyCoins = require("./src/payments/processBuyCoins");

const processUserCreated = require("./src/user/processUserCreated");
const processContainerCreated = require("./src/containers/processContainerCreated");
const processContainerWritten = require("./src/containers/processContainerWritten");
const userTopUp = require("./src/user/userTopUp");

const {
  updateDockerImages,
  getDockerInfo,
} = require("./src/services/mainService");
const processMachineWritten = require("./src/machines/processMachineWritten");
const jsonPath = path.join(__dirname, "assets/fake-data.json");

admin.initializeApp({
  projectId:
    process.env.APP_ENVIRONMENT === "development"
      ? `demo-${process.env.APP_FIREBASE_PROJECT_ID}`
      : `${process.env.APP_FIREBASE_PROJECT_ID}`,
});

exports.processUserCreated = functions.auth.user().onCreate(processUserCreated);

exports.processBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  processBuyCoins
);

exports.userTopUp = onDocumentCreated("payments/{paymentId}", userTopUp);

exports.processContainerCreated = onDocumentCreated(
  "containers/{containerId}",
  processContainerCreated
);

exports.processContainerWritten = onDocumentWritten(
  "containers/{containerId}",
  processContainerWritten
);

exports.processMachineWritten = onDocumentWritten(
  "machines/{machineId}",
  processMachineWritten
);

(async () => {
  return;

  const db = admin.firestore();
  const batch = db.batch();

  try {
    /*-------------------*/
    /* Docker            */
    /*-------------------*/
    // console.log("Updating docker images..");
    await updateDockerImages();
    await getDockerInfo();

    /*-------------------*/
    /* Statistics        */
    /*-------------------*/
    const statisticsRef = db.collection("statistics");
    const types = [
      "comments",
      "info",
      "users",
      "totalReviews",
      "totalImages",
      "totalVideos",
      "totalOwnerReviews",
      "totalValidateComments",
      "totalValidateInfo",
      "earnings",
    ];
    for (const type of types) {
      const ref = statisticsRef.doc(type);
      const doc = await ref.get();
      if (doc.exists) {
        console.log(`Statistics ${type} already exists`);
        continue;
      }

      batch.set(ref, {
        total: 0,
      });
    }

    /*-------------------*/
    /* Settings          */
    /*-------------------*/
    const coinPriceArr = [
      {
        tag: "cost",
        value: 0.02,
        type: "coin",
      },
      {
        tag: "bonus",
        value: 100,
        type: "coin",
      },
      {
        tag: "image",
        value: 2,
        type: "coin",
      },
      {
        tag: "video",
        value: 3,
        type: "coin",
      },
      {
        tag: "response",
        value: 1,
        type: "coin",
      },
      {
        tag: "review",
        value: 1,
        type: "coin",
      },
      {
        tag: "validation",
        value: 3,
        type: "coin",
      },

      // General settings
      {
        tag: "logo",
        value: "https://picsum.photos/200",
        type: "general",
      },
      {
        tag: "favicon",
        value: "https://picsum.photos/200",
        type: "general",
      },
      {
        tag: "title",
        value: "GMR Scrap",
        type: "general",
      },
      {
        tag: "description",
        value: "GMR Scrap",
        type: "general",
      },
      {
        tag: "keywords",
        value: "GMR Scrap",
        type: "general",
      },

      // Scrap settings
      {
        tag: "minimum",
        value: 100,
        type: "scrap",
      },
      {
        tag: "maximum",
        value: 1000,
        type: "scrap",
      },
      {
        tag: "retries",
        value: 10,
        type: "scrap",
      },

      // Docker settings
      {
        tag: "minimumCPU",
        value: 2,
        type: "docker",
      },
      {
        tag: "minimumRAM",
        value: 4,
        type: "docker",
      },
      {
        tag: "minimumStorage",
        value: 10,
        type: "docker",
      },

      // Stripe settings
      {
        tag: "publishableKey",
        value:
          "pk_test_51I9H7rGz9L9d5a7m9BcFJ9pZQ0q8VX8QX9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ",
        type: "stripe",
      },
      {
        tag: "secretKey",
        value:
          "sk_test_51I9H7rGz9L9d5a7m9BcFJ9pZQ0q8VX8QX9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ1tS1HgK0Q0J9Y1tG9tJ",
        type: "stripe",
      },
    ];
    for (const coinPrice of coinPriceArr) {
      const ref = db.collection("settings").doc();
      const doc = await ref.get();
      if (doc.exists) {
        console.log(`Settings ${coinPrice.id} already exists`);
        continue;
      }

      batch.set(ref, coinPrice);
    }

    /*-------------------*/
    /* Fake earnings     */
    /*-------------------*/
    const earningsRef = db.collection("earnings");
    const earningsSnap = await earningsRef.get();
    if (earningsSnap.empty) {
      const months = 12;
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const earnings = [];
      for (let i = 0; i < months; i++) {
        const date = new Date(year, month - i, 1);
        const timestamp = Timestamp.fromDate(date);
        const amount = Math.floor(Math.random() * 14000) + 1000;
        earnings.push({
          amount,
          createdAt: timestamp,
          paymentId: `payment-${i}`,
          userId: "user",
        });
      }

      for (const earning of earnings) {
        const ref = earningsRef.doc(earning.paymentId);
        batch.set(ref, earning);
      }

      // Add the total earnings to statistics
      const totalEarningsRef = db.doc("statistics/earnings");
      const totalEarningsSnap = await totalEarningsRef.get();
      if (!totalEarningsSnap.exists) {
        batch.set(totalEarningsRef, {
          total: earnings.reduce((acc, curr) => acc + curr.amount, 0),
        });
      }
    } else {
      console.log("Earnings already exists");
    }

    /*-------------------*/
    /* Fake data         */
    /*-------------------*/
    const data = JSON.parse(fs.readFileSync(jsonPath));
    const containerRef = db.collection("containers");
    for (const container of data) {
      const ref = containerRef.doc(`${container.type}_${container.reviewId}`);
      if ((await ref.get()).exists) {
        console.log(
          `Container ${container.type}_${container.reviewId} already exists`
        );
        continue;
      }
      batch.set(ref, {
        ...container,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        location: new GeoPoint(container.location[0], container.location[1]),
      });
    }

    await batch.commit();
  } catch (error) {
    console.error(error);
  }
})();
