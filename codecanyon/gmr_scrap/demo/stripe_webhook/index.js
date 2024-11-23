require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Use raw body to verify Stripe signatures
app.use(bodyParser.raw({ type: "application/json" }));

app.post("/webhook", (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
      console.log("PaymentIntent was successful:", paymentIntent);
      break;
    // Add more cases for other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("Received!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
