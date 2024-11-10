require("dotenv").config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/firestore");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "";

admin.initializeApp();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const endPointURL = process.env.ENDPOINT_URL;

function createToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: "12h" });
}

async function postReview(data) {
  const token = createToken(data);
  try {
    const response = await fetch(endPointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting review:", error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
}

async function postReviewInfo(data) {
  const token = createToken(data);
  try {
    const response = await fetch(`${endPointURL}/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting review:", error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
}

exports.watchBuyCoins = onDocumentCreated(
  "users/{userId}/buyCoins/{coinId}",
  async (event) => {
    const { userId } = event.params;
    const { amount } = event.data.data();

    const batch = admin.firestore().batch(); // Create a batch for atomic operations

    try {
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Custom Amount" },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:4200/payments",
        cancel_url: "http://localhost:4200/payments",
        payment_intent_data: {
          metadata: { userId },
        },
      });

      console.log("Stripe session URL:", session.url);

      // Store the session URL in Firestore using the batch
      const userBuyCollection = admin
        .firestore()
        .collection(`users/${userId}/buy`);
      const newDocRef = userBuyCollection.doc(); // Automatically generate a new document ID
      batch.set(newDocRef, { url: session.url });

      // Commit the batch
      await batch.commit();
      console.log("Session URL added to Firestore successfully");
    } catch (error) {
      console.error("Error creating Stripe session:", error);
    }
  }
);

exports.watchStatus = onDocumentUpdated("status/app", async (event) => {
  const statusDocRef = event.data.after.ref;

  try {
    await admin.firestore().runTransaction(async (transaction) => {
      const statusSnapshot = await transaction.get(statusDocRef);
      const newStatus = statusSnapshot.data();

      if (newStatus.active) {
        // If already active, exit the transaction
        return;
      }

      // After the transaction completes, process the pending collection
      const pendingCollection = admin.firestore().collection(`pending`);
      const pendingSnapshot = await pendingCollection.get();
      const pendingDocs = pendingSnapshot.docs;

      if (pendingDocs.length === 0) {
        return;
      }

      const pendingDoc = pendingDocs[0];
      const review = pendingDoc.data();

      await postReview(review); // This is outside of transaction since it involves external processing
      await pendingDoc.ref.delete();

      // Set active to true within the transaction
      transaction.update(statusDocRef, { active: true });
    });
  } catch (error) {
    console.error("Error posting review:", error);
  }
});

exports.watchPending = onDocumentCreated(
  "pending/{pendingId}",
  async (event) => {
    const statusDoc = admin.firestore().doc(`status/app`);

    await admin.firestore().runTransaction(async (transaction) => {
      const statusSnapshot = await transaction.get(statusDoc);
      const status = statusSnapshot.data();
      const statusCount = status?.count || 0;

      transaction.update(statusDoc, {
        count: statusCount + 1,
      });
    });
  }
);

exports.watchNewReview = onDocumentCreated(
  "users/{userId}/reviews/{reviewId}",
  async (event) => {
    console.log("event:", event);
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const review = snapshot.data();
    const pendingCollection = admin.firestore().collection(`pending`);
    await pendingCollection.add({
      ...review,
      reviewId: event.params.reviewId,
      userId: event.params.userId,
    });
  }
);

exports.stripeWebhook = functions.https.onRequest(
  { raw: true },
  async (request, response) => {
    const signature = request.headers["stripe-signature"];
    let event;

    // Verify webhook signature if endpointSecret is defined
    try {
      event = endpointSecret
        ? stripe.webhooks.constructEvent(
            request.rawBody,
            signature,
            endpointSecret
          )
        : JSON.parse(request.rawBody);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err.message);
      return response.sendStatus(400);
    }

    const {
      type,
      data: { object: paymentIntent },
    } = event;
    const { userId } = paymentIntent.metadata || {};

    if (!userId) {
      console.error("⚠️ No userId found in payment metadata");
      return response.sendStatus(400);
    }

    const userPaymentsRef = admin
      .firestore()
      .collection(`users/${userId}/payments`);
    const userRef = admin.firestore().doc(`users/${userId}`);

    // Create a Firestore batch
    const batch = admin.firestore().batch();

    try {
      if (
        type === "payment_intent.succeeded" ||
        type === "payment_intent.payment_failed"
      ) {
        // Add payment data to Firestore
        const paymentDocRef = userPaymentsRef.doc();
        batch.set(paymentDocRef, {
          amount: paymentIntent.amount,
          created: admin.firestore.Timestamp.now(),
          payment_method: paymentIntent.payment_method,
          status: paymentIntent.status,
        });

        // If payment succeeded, update user's coin balance
        if (type === "payment_intent.succeeded") {
          const userDoc = await userRef.get();
          const currentBalance = userDoc.exists
            ? userDoc.data().coinBalance || 0
            : 0;

          // Update the coin balance
          batch.set(
            userRef,
            { coinBalance: currentBalance + paymentIntent.amount },
            { merge: true }
          );
        }
      } else {
        console.log(`Unhandled event type ${type}`);
      }

      // Commit the batch
      await batch.commit();
      response.sendStatus(200);
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return response.sendStatus(500);
    }
  }
);

// Trigger function on document update
exports.onReviewCompleted = onDocumentUpdated(
  "users/{userId}/reviews/{reviewId}",
  async (event) => {
    const statusDoc = admin.firestore().doc("status/app");

    const { userId, reviewId } = event.params;
    const updatedReview = event.data.after.data();

    console.log("Changes: ", updatedReview);

    if (updatedReview && updatedReview.status === "failed") {
      await statusDoc.set({ active: false }, { merge: true });
    }

    // Check if the document exists and the status is completed
    if (updatedReview && updatedReview.status === "completed") {
      console.log("Status:", updatedReview.status);
      console.log("Review updated:", updatedReview);

      // Reference to the user document
      const userRef = admin.firestore().collection("users").doc(userId);
      const userSnapshot = await userRef.get();

      // Default values for new user
      let currentCoinBalance = 0;

      // Check if user exists, otherwise set default values
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        currentCoinBalance = userData?.coinBalance || 0;
      } else {
        // Set default values for new user document
        await userRef.set({
          coinBalance: currentCoinBalance,
          lastScraped: new Date(),
        });
      }

      // Start a batch operation
      const batch = admin.firestore().batch();

      // Add a new document to the user's usage subcollection
      const usageRef = admin
        .firestore()
        .collection(`users/${userId}/usage`)
        .doc();
      batch.set(usageRef, {
        title: updatedReview.title || "Untitled", // Handle missing title
        reviewId,
        url: updatedReview.url || "", // Handle missing URL
        createdAt: new Date(),
        spentCoins: updatedReview.totalReviews || 0,
      });

      // Update the user's coin balance and lastScraped timestamp, using set with merge to avoid overwriting other fields
      batch.set(
        userRef,
        {
          lastScraped: new Date(),
          coinBalance: currentCoinBalance - updatedReview.totalReviews,
        },
        { merge: true }
      );

      await statusDoc.set({ active: false }, { merge: true });

      // Commit the batch
      await batch.commit();
    }
  }
);

exports.watchReviewOverview = onDocumentCreated(
  "users/{userId}/reviewOverview/{reviewId}",
  async (event) => {
    console.log("event:", event);
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const review = snapshot.data();
    const info = await postReviewInfo(review);
    await snapshot.ref.set(info, { merge: true });
    console.log("Info posted:", info);
  }
);
