const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
  const { eventName, customerEmail, amount, currency } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: eventName,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.FRONTEND_URL}/events/success`,
      cancel_url: `${process.env.FRONTEND_URL}/events/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
