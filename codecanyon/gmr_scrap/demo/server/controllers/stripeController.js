const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { db } = require("../firebase");

const successUrl = process.env.SUCCESS_URL;
const cancelUrl = process.env.CANCEL_URL;

exports.createCheckoutSession = async (req, res) => {
  const { amount, userId } = req.data;
  let currency = "usd";
  let costs = 1;
  let unit_amount = amount;
  const settings = await db.doc("app/settings").get();

  if (settings.exists) {
    const data = settings.data();
    currency = data.currency || "usd";
    costs = Number(data.costs || 1);
  }

  unit_amount = unit_amount * costs;

  console.log("Currency: ", currency);
  console.log("Costs: ", costs);
  console.log("Unit Amount: ", unit_amount);

  try {
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
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: { metadata: { userId } },
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.webhookHandler = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
    const userId = paymentIntent.metadata.userId;
    const userPaymentsRef = db.collection(`users/${userId}/payments`);
    const userRef = db.doc(`users/${userId}`);
    const batch = db.batch();

    if (type === "payment_intent.succeeded") {
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
    } else {
      console.log(`Unhandled event type ${type}`);
    }

    await batch.commit();
    res.status(200).send("Received!");
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
