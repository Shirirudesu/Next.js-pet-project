import { loadStripe } from '@stripe/stripe-js';
import { useSession } from "next-auth/react";
import { useState, useEffect } from 'react';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const products = [
  { id: 1, name: '50 Credits', price: 5, image: 'credits1.jpg', quantity: 1 },
  { id: 2, name: '170 credits', price: 15, image: 'credits2.jpg', quantity: 1 },
  { id: 3, name: '350 credits', price: 30, image: 'credits3.jpg', quantity: 1 },
];

export default function Checkout() {
  const [quantities, setQuantities] = useState({
    1: 1, 
    2: 1,
    3: 1,
  }); //added this
  const { status, data: session } = useSession();

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: Number(value) }); // saving new value
  };


  const calculatePrice = (productId) => {
    const product = products.find((item) => item.id === productId);
    const quantity = quantities[productId];
    return product.price * quantity;
  }; //added this!



  const handleCheckout = async (id) => {
    const quantity = quantities[id] || 1;
    const stripe = await stripePromise;
    const response = await fetch('/api/checkout-sessions/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: products,
        returnUrl: window.location.origin,
        itemId: id,
        email: session.user?.email,       
        quantity: quantity,
      }),
    });
    const { sessionId } = await response.json();
    await stripe.redirectToCheckout({ sessionId });
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-6">
    <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">💳 Buy Credits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-100 rounded-lg p-6 shadow hover:shadow-md transition">
            <img src={`/${product.image}`} alt={product.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-1">Price: <strong>${product.price}</strong></p>
            <label className="flex items-center gap-2">
            Quantity:
            <input
              type="number"
              min="1"
              className="w-16 p-1 border rounded"
              value={quantities[product.id] || 1} 
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
            />
          </label>
          <p className="text-lg font-semibold">
            Total Price: ${calculatePrice(product.id)}
          </p>
            <button
              onClick={() => handleCheckout(product.id)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}


