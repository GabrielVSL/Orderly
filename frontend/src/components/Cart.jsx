import React from 'react';
import { useCart } from '../context/CartContext';

function QuantityPicker({ item, isLoading, onQuantityChange }) {
  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    onQuantityChange(item.id, newQuantity);
  };

  return (
    <select
      value={item.quantity}
      onChange={handleChange}
      disabled={isLoading}
      style={{ margin: '0 10px' }}
    >
      {quantityOptions.map(qty => (
        <option key={qty} value={qty}>
          Qty: {qty}
        </option>
      ))}
    </select>
  );
}

function Cart() {
  const { cartItems, isLoading, error, removeFromCart, updateQuantity } = useCart();

  if (isLoading) {
    return <div>Loading cart...</div>;
  }
  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
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
              <div>
                <span>{item.product.name}</span>

                <QuantityPicker 
                  item={item} 
                  isLoading={isLoading}
                  onQuantityChange={updateQuantity}
                />

              </div>
              <div>
                <span>${(item.quantity * item.product.price).toFixed(2)}</span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  disable={isLoading}
                  style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                >
                  remove
                </button>
              </div>
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