const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");
const successUrl = process.env.SUCCESS_URL;
const cancelUrl = process.env.CANCEL_URL;

exports.createCheckoutSession = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const { url } = await stripe.checkout.sessions.create({
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
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: { metadata: { userId } },
    });

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  const userId = req.body.data.object.metadata.userId;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const userPaymentsRef = admin
    .firestore()
    .collection(`users/${userId}/payments`);
  const userRef = admin.firestore().doc(`users/${userId}`);

  // Create a Firestore batch
  const batch = admin.firestore().batch();

  let event;
  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const paymentDocRef = userPaymentsRef.doc();
      batch.set(paymentDocRef, {
        amount: paymentIntent.amount,
        created: admin.firestore.Timestamp.now(),
        payment_method: paymentIntent.payment_method,
        status: paymentIntent.status,
      });

      const userDoc = await userRef.get();
      const currentBalance = userDoc.exists
        ? userDoc.data().coinBalance || 0
        : 0;

      batch.set(
        userRef,
        { coinBalance: currentBalance + paymentIntent.amount },
        { merge: true }
      );
      break;
    // Add more cases for other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  await batch.commit();
  res.status(200).send("Received!");
};
