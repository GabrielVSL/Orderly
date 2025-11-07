import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext'; //

export const OrderSummary = ({ className = '', ...props }) => {
  const { cartItems } = useCart(); //

  const totalPrice = cartItems.reduce((total, item) => {
    if (item && item.product && item.product.price) {
      return total + (item.quantity * item.product.price);
    }
    return total;
  }, 0);
  
  const delivery = 0;
  const grandTotal = totalPrice + delivery;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-white p-6 rounded-2xl border-2 border-purple-200/50 ${className}`}
      {...props}
    >
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h3>

      <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-10 h-10 object-cover rounded-md mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-800">{item.product.name}</div>
                  <div className="text-brand-gray">
                    Qty: {item.quantity}
                  </div>
                </div>
              </div>
              <span className="font-medium text-gray-700">
                ${(item.quantity * item.product.price).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-brand-gray text-center">Your cart is empty.</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="h-px bg-purple-200/50 my-4" />
      )}

      <div className="space-y-2">
        <div className="flex justify-between text-brand-gray">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-brand-gray">
          <span>Delivery</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <div className="h-px bg-purple-200/50 my-3" />
        <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
          <span>Total</span>
          <span className="text-brand-purple">${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;