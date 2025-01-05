const fs = require("fs");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { db } = require("../firebase");
const { Timestamp } = require("firebase-admin/firestore");

exports.createCheckoutSession = async (req, res) => {
  const { amount, userId } = req.data;

  try {
    // Fetch app settings and set defaults
    const settings = await db.doc("app/settings").get();
    const { currency = "usd", costs = 1 } = settings.exists
      ? settings.data()
      : {};

    const unit_amount = amount * Number(costs);

    // Log for debugging
    console.log({ currency, costs, unit_amount });

    // Create checkout session
    const { url } = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Custom Amount" },
            unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      payment_intent_data: { metadata: { userId } },
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  fs.readFile(
    process.env.STRIPE_WEBHOOK_SECRET_FILE,
    "utf-8",
    async (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err.message}`);
        return res.status(500).send("Error reading file");
      }
      const endpointSecret = data.trim();
      const signature = req.headers["stripe-signature"];

      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
        const {
          type,
          data: { object: paymentIntent },
        } = event;

        if (type !== "payment_intent.succeeded") {
          console.log(`Unhandled event type: ${type}`);
          return res.status(200).send("Event ignored");
        }

        const chargeId = paymentIntent.charges.data[0].id;
        const charge = await stripe.charges.retrieve(chargeId);
        const userId = paymentIntent.metadata.userId;
        const userPaymentsRef = db.collection(`users/${userId}/payments`);
        const userRef = db.doc(`users/${userId}`);
        const batch = db.batch();

        // Add payment to user's payment collection
        batch.set(userPaymentsRef.doc(), {
          amount: paymentIntent.amount,
          createdAt: Timestamp.now(),
          payment_method: paymentIntent.payment_method,
          status: paymentIntent.status,
          charge,
        });

        // Update user's coin balance
        const userDoc = await userRef.get();
        const currentBalance = userDoc.exists
          ? userDoc.data().coinBalance || 0
          : 0;
        batch.set(
          userRef,
          { coinBalance: currentBalance + paymentIntent.amount },
          { merge: true }
        );

        await batch.commit();
        res.status(200).send("Webhook received and processed");
      } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );
};
