const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// No need to initialize the Stripe client here
// const stripe = require('stripe')(functions.config().stripe.api_key);

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { amount } = data;
  const stripe = require('stripe')(functions.params.defineSecret('STRIPE_SECRET_KEY').value()); // Retrieve the secret here

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    const { client_secret: clientSecret, id } = paymentIntent;

    return {
      id,
      clientSecret,
      amount,
      message: "Created",
    };
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error);
  }
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const stripe = require('stripe')(functions.params.defineSecret('STRIPE_SECRET_KEY').value()); // Retrieve the secret here

  console.log("Webhook called.");
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, functions.params.defineSecret('STRIPE_WEBHOOK_SECRET').value());
  } catch (error) {
    console.error(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");
      break;
    case "payment_intent.payment_failed":
      const paymentFailed = event.data.object;
      console.log("PaymentIntent failed!");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});
