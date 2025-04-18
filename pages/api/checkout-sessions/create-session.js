import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  // Handle POST request to create a Stripe Checkout session
  if (req.method === 'POST') {
    try {
      const { cartItems, returnUrl, itemId, email, quantity } = req.body;

      const filteredItems = cartItems.filter(i => i.id === itemId)



      const line_items = filteredItems.map((item) => {
        const totalPrice = item.price * quantity;
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price * 100, // Price in cents
          },
          quantity: quantity || 1,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${returnUrl}`, 
        customer_email: email,
        metadata: {email: email, product: line_items[0].price_data.product_data.name, quantity}
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {

      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
