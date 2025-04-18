import { useState } from 'react';

const OrderSummary = ({ session }) => {
  const formatAddress = (address) => {
    const { line1, line2, city, state, postal_code, country } = address;
    const formattedAddress = [line1, line2, city, state, postal_code, country]
      .filter(Boolean)
      .join(', ');
    return formattedAddress || 'N/A';
  };

  return (
    <div>
      <h2>Order Summary</h2>
      <p>Order ID: {session.id}</p>
      <p>Total Amount: ${session.amount_total / 100}</p>
      <p>Shipping Address: {formatAddress(session.shipping.address)}</p>
      <div>
        <h3>Line Items</h3>
        {session.line_items.data.map((item) => (
          <div key={item.id}>
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.amount_total / 100}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
