const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { getUserData, addPayments } = require("../services/firebaseService");

exports.createCheckoutSession = async (req, res) => {
  const { amount, userId } = req.data;

  try {
    const user = await getUserData(userId);
    const userEmail = user.email;

    const customer = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId;

    // Check if a customer with the given email exists
    if (customer.data.length === 0) {
      // Create a new customer and assign the ID
      const newCustomer = await stripe.customers.create({ email: userEmail });
      customerId = newCustomer.id;
    } else {
      // Use the existing customer's ID
      customerId = customer.data[0].id;
    }

    console.log(`Customer ID: ${customerId}`);

    // Create checkout session
    const { url } = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Custom Amount" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.STRIPE_SUCCESS_URL}/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}/{CHECKOUT_SESSION_ID}`,
      payment_intent_data: { metadata: { userId } },
      customer: customerId,
    });

    res.status(200).json({ url });
  } catch (error) {
    console.error(error.message);
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
        const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        await addPayments(event.data.object);

        res.status(200).send("Webhook received and processed");
      } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }
  );
};
