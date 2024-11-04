require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/firestore');
admin.initializeApp();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const endPointURL = 'http://34.46.41.115/api/reviews';

async function postReview(data) {
  try {
    const response = await fetch(endPointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error posting review:', error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
}

exports.watchBuyCoins = onDocumentCreated('users/{userId}/buyCoins/{coinId}', async (event) => {
  const snapshot = event.data;
  const coin = snapshot.data();
  const amount = coin.amount;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Custom Amount",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:4200/payments",
    cancel_url: "http://localhost:4200/payments",
    payment_intent_data: {  // Add metadata to payment intent directly
      metadata: {
        userId: event.params.userId,
      },
    },
  });

  console.log('session:', session);

  const userCollection = admin.firestore().collection(`users/${event.params.userId}/buy`);
  await userCollection.add({
    url: session.url,
  });
});

exports.watchStatus = onDocumentUpdated('status/app', async (event) => {
  const newValue = event.data.after.data();
  console.log('newValue:', newValue);
  const newStatusActive = newValue.active;

  if (!newStatusActive) {
    const pendingCollection = admin.firestore().collection(`pending`);
    const pendingSnapshot = await pendingCollection.get();
    const pendingDocs = pendingSnapshot.docs;
    if (pendingDocs.length === 0) {
      return;
    }
    const pendingDoc = pendingDocs[0];
    const review = pendingDoc.data();
    try {
      // set status active to true
      await event.data.after.ref.update({
        active: true,
      });
      await postReview(review);
      await pendingDoc.ref.delete();
    } catch (error) {
      console.error('Error posting review:', error);
    }
  }
});

exports.watchPending = onDocumentCreated('pending/{pendingId}', async (event) => {
  const statusDoc = admin.firestore().doc(`status/app`);
  const statusSnapshot = await statusDoc.get();
  const status = statusSnapshot.data();
  const statusActive = status.active;

  if (!statusActive) {
    const snapshot = event.data;
    const review = snapshot.data();
    try {
      await statusDoc.update({
        active: true,
      });
      await postReview(review);
      await snapshot.ref.delete();
    } catch (error) {
      console.error('Error posting review:', error);
    }
  }
});

exports.watchNewReview = onDocumentCreated('users/{userId}/reviews/{reviewId}', async (event) => {
  console.log('event:', event);
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
  });
});

exports.stripeWebhook = functions.https.onRequest({ raw: true }, async (request, response) => {
  let event = request.rawBody;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  console.log(event);

  // checkout.session.completed
  // payment_intent.payment_failed
  // payment_intent.succeeded
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('metadata-->', paymentIntent.metadata);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      await admin.firestore().collection(`users/${paymentIntent.metadata.userId}/payments`).add({
        amount: paymentIntent.amount,
        created: admin.firestore.Timestamp.now(),
        payment_method: paymentIntent.payment_method,
        status: paymentIntent.status,
      });
      const userRef = admin.firestore().doc(`users/${paymentIntent.metadata.userId}`);
      const userDoc = await userRef.get();
      const user = userDoc.data();
      const coinBalance = user.coinBalance || 0;
      await userRef.update({
        coinBalance: coinBalance + paymentIntent.amount,
      });
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      await admin.firestore().collection(`users/${paymentMethod.metadata.userId}/payment_methods`).add({
        payment_method: paymentMethod.id,
        created: admin.firestore.Timestamp.now(),
      });
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

