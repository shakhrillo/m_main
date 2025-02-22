const fs = require("fs").promises;
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { getUserData, addPayments } = require("../services/firebaseService");

/**
 * Retrieves or creates a Stripe customer based on the user's email.
 * @param {string} email - User's email address
 * @returns {Promise<string>} - Stripe Customer ID
 */
const getOrCreateCustomer = async (email) => {
  try {
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    const newCustomer = await stripe.customers.create({ email });
    return newCustomer.id;
  } catch (error) {
    console.error("Error retrieving/creating customer:", error.message);
    throw new Error("Failed to retrieve or create Stripe customer.");
  }
};

/**
 * Creates a Stripe Checkout session.
 */
exports.createCheckoutSession = async (req, res) => {
  const { amount, cost, userId } = req.machine;

  if (!amount || !userId) {
    return res.status(400).json({ error: "Missing amount or userId" });
  }

  try {
    const user = await getUserData(userId);
    if (!user || !user.email) {
      return res.status(404).json({ error: "User not found or missing email" });
    }

    const customerId = await getOrCreateCustomer(user.email);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Custom Amount" },
            unit_amount: Math.round(cost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.STRIPE_SUCCESS_URL}/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}/{CHECKOUT_SESSION_ID}`,
      payment_intent_data: { metadata: { userId, amount } },
      customer: customerId,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
};

/**
 * Handles Stripe webhook events.
 */
exports.webhookHandler = async (req, res) => {
  try {
    let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (process.env.APP_ENVIRONMENT === "development") {
      endpointSecret = (await fs.readFile(process.env.STRIPE_WEBHOOK_SECRET_FILE, "utf-8")).trim();
    }
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ error: "Missing Stripe signature" });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook Signature Error: ${err.message}`);
      return res.status(400).json({ error: `Webhook signature verification failed.` });
    }

    console.log("Webhook event received:", event.type);

    // Process the payment event
    await addPayments({
      type: event.type,
      ...event.data.object,
    });

    res.status(200).send("Webhook received and processed");
  } catch (error) {
    console.error(`Webhook Handler Error: ${error.message}`);
    res.status(500).json({ error: "Failed to process webhook." });
  }
};
