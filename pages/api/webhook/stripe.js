import Stripe from 'stripe';
import User from '../../../models/User';
import {buffer} from 'micro'
export const config = {
  api: {
    bodyParser: false
  }
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  const requestBuffer = await buffer(req);
const payload = requestBuffer;
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    let event;
console.log("Webhook")
console.log(req.body)
console.log(endpointSecret)
console.log(req.headers)



    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const obj = event.data.object;
        const theUser = obj.customer_email;
       
        const products = [
          { name: '50 Credits', amount: 50 },
          { name: '170 credits', amount: 170 },
          {name: '350 credits', amount: 350 },
        ];
        const creditAmount = products.filter(i => i.name === obj.metadata.product)[0].amount * parseInt(obj.metadata.quantity)

        console.log(theUser)
        console.log(creditAmount)
        const ant = await User.updateOne({ email: theUser }, { $inc: { credits: creditAmount } })
console.log(ant)
        // Handle successful subscription payment
        break;
      // Add more cases for other event types you want to handle
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
