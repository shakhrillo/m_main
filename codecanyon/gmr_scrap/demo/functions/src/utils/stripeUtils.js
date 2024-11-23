const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "");
const successUrl = process.env.SUCCESS_URL || "";
const cancelUrl = process.env.CANCEL_URL || "";

async function getCheckoutSessionUrl(amount, userId) {
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

    return url;
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw error;
  }
}

module.exports = {
  getCheckoutSessionUrl,
};
