const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    const { amount } = req.body; // Amount in cents, e.g., 500 for $5.00

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Custom Amount",
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:4200/payments",
            cancel_url: "http://localhost:4200/payments",
            metadata: {
                userId: req.user.uid,
            },
        });

        // Redirect to Stripe checkout URL
        // res.redirect(303, session.url);
        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
