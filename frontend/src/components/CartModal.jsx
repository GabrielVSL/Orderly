import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import CartItemRow from './CartItemRow'; 

function CartModal() {
  const { 
    cartItems, 
    isLoading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    checkout, 
    isCartOpen,
    closeCart
  } = useCart();

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);

  const delivery = 0; 
  const grandTotal = totalPrice + delivery;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div 
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <SparklesIcon className="h-7 w-7 text-brand-purple mr-2" />
                Your Cart
              </h2>
              <button onClick={closeCart} className="p-2 text-gray-500 hover:text-gray-900">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && cartItems.length === 0 && <p>Loading cart...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              
              {cartItems.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 mt-20">
                  <ShoppingCartIcon className="h-24 w-24 mx-auto text-gray-300" />
                  <h3 className="text-xl font-semibold mt-4">Your cart is empty</h3>
                  <p>Add some amazing products!</p>
                </div>
              )}

              {cartItems.map(item => (
                <CartItemRow 
                  key={item.id} 
                  item={item} 
                  isLoading={isLoading}
                  removeFromCart={removeFromCart} 
                  updateQuantity={updateQuantity} 
                />
              ))}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${Number(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${Number(grandTotal).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={checkout} 
                  disabled={isLoading}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-lg font-semibold transition-all duration-150 shadow-md hover:shadow-lg disabled:bg-gray-400 active:scale-95"
                >
                  {isLoading ? 'Processing...' : 'Go to Checkout'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartModal;