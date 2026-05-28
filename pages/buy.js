import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const products = [
  { id: 1, name: "50 Credits", price: 5, image: "credits1.jpg", quantity: 1 },
  { id: 2, name: "170 credits", price: 15, image: "credits2.jpg", quantity: 1 },
  { id: 3, name: "350 credits", price: 30, image: "credits3.jpg", quantity: 1 },
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
    const response = await fetch("/api/checkout-sessions/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    <div className="min-h-screen bg-zinc-100 py-12 px-6">
      {" "}
      <div className="max-w-5xl mx-auto">
        {" "}
        <div className="mb-10">
          {" "}
          <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight">
            {" "}
            Buy Credits{" "}
          </h1>{" "}
          <p className="text-zinc-500 mt-2">
            {" "}
            Choose the amount of credits you want to purchase{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-zinc-200 rounded-2xl p-6 transition hover:border-zinc-300"
            >
              {" "}
              <div className="flex justify-center mb-5">
                {" "}
                <img
                  src={`/${product.image}`}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <h2 className="text-xl font-medium text-zinc-900">
                  {" "}
                  {product.name}{" "}
                </h2>{" "}
                <p className="text-sm text-zinc-500">
                  {" "}
                  ${product.price} per credit{" "}
                </p>{" "}
              </div>{" "}
              <div className="mt-6">
                {" "}
                <label className="block text-sm text-zinc-600 mb-2">
                  {" "}
                  Quantity{" "}
                </label>{" "}
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white outline-none focus:border-zinc-500"
                />{" "}
              </div>{" "}
              <div className="mt-5 flex items-center justify-between">
                {" "}
                <span className="text-sm text-zinc-500"> Total </span>{" "}
                <span className="text-xl font-semibold text-zinc-900">
                  {" "}
                  ${calculatePrice(product.id)}{" "}
                </span>{" "}
              </div>{" "}
              <button
                onClick={() => handleCheckout(product.id)}
                className="w-full mt-6 h-11 rounded-xl bg-zinc-900 text-white font-medium transition hover:bg-zinc-800"
              >
                {" "}
                Continue{" "}
              </button>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
