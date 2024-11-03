require('dotenv').config();
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.stripeWebhook = functions.https.onRequest({ raw: true }, async (request, response) => {
  let event = request.rawBody;
  console.log(event);
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

  // checkout.session.completed
  // payment_intent.payment_failed
  // payment_intent.succeeded
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
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
      await userRef.update({
        coinBalance: user.coinBalance + paymentIntent.amount,
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

