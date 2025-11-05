import React from 'react';
import { useCart } from '../context/CartContext'; // Get our global cart brain

function Cart() {
  // Get all the data and tools from our CartContext
  const { cartItems, isLoading, error } = useCart();

  // We can use the same loading state from the context
  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    // We can access item.product.price because of our backend "include"
    return total + (item.quantity * item.product.price);
  }, 0);

  return (
    <div className="cart-container" style={{ border: '2px solid black', padding: '10px', marginTop: '20px' }}>
      <h2>Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
              <span>{item.product.name}</span>
              <span>(Qty: {item.quantity})</span>
              <span>${(item.quantity * item.product.price).toFixed(2)}</span>
            </div>
          ))}
          <div className="cart-total" style={{ marginTop: '10px', fontWeight: 'bold' }}>
            <strong>Total: ${totalPrice.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;