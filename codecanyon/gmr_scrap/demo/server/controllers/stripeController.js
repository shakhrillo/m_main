const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { db } = require("../firebase");
const successUrl = process.env.SUCCESS_URL;
const cancelUrl = process.env.CANCEL_URL;

exports.createCheckoutSession = async (req, res) => {
  const { amount, userId } = req.data;

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
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(event.data.object.metadata);
  console.log(`Received event with type: ${event.type}`);

  const userId = event.data.object.metadata.userId;
  const userPaymentsRef = db.collection(`users/${userId}/payments`);
  const userRef = db.doc(`users/${userId}`);

  // Create a Firestore batch
  const batch = db.batch();

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const paymentDocRef = userPaymentsRef.doc();
      batch.set(paymentDocRef, {
        amount: paymentIntent.amount,
        created: new Date(paymentIntent.created * 1000),
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
