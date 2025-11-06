import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
// We'll use Heroicons to match our stack
import { ShoppingCartIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

// This is the new, single-column page from
function CheckoutPage() {
  const { cartItems, isLoading, placeOrder } = useCart();
  const [focusedField, setFocusedField] = useState(null);

  // This state is just to make the UI interactive for the simulation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.quantity * item.product.price);
  }, 0);
  const delivery = 0; // Dummy data from wireframe
  const grandTotal = totalPrice + delivery;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    placeOrder(); // This will clear the cart and navigate to /success
  };
  
  // This is from your TSX file, converted.
  const inputFields = [
    { id: "name", label: "Full Name", icon: UserIcon, type: "text", placeholder: "John Doe" },
    { id: "email", label: "Email", icon: EnvelopeIcon, type: "email", placeholder: "john@example.com" },
    { id: "phone", label: "Phone Number", icon: PhoneIcon, type: "tel", placeholder: "+1 (555) 000-0000" },
  ];

  return (
    // This is the background from your TSX
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-brand-light via-purple-50 to-pink-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto" // This is the single column
      >
        {/* We use a <form> so 'onSubmit' works */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-200/50">
            <h1 className="flex items-center gap-3 text-3xl font-bold mb-2 text-gray-900">
              <ShoppingCartIcon className="w-8 h-8 text-brand-purple" />
              Checkout
            </h1>
            <p className="text-brand-gray">Complete your order details</p>
          </div>
          
          {/* Form Content Area */}
          <div className="p-8">
            <div className="space-y-6">
              
              {/* Input Fields */}
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <label htmlFor={field.id} className="text-base font-semibold flex items-center gap-2 mb-2 text-gray-800">
                    <field.icon className="w-4 h-4 text-brand-purple" />
                    {field.label}
                  </label>
                  <motion.div
                    animate={{ scale: focusedField === field.id ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      value={formData[field.id]}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      className="w-full h-12 px-4 rounded-xl border-2 border-purple-200/50 focus:border-brand-purple focus:ring-brand-purple transition-all duration-300 bg-white/50 focus:bg-white"
                    />
                  </motion.div>
                </motion.div>
              ))}

              {/* Address Textarea */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="address" className="text-base font-semibold flex items-center gap-2 mb-2 text-gray-800">
                  <MapPinIcon className="w-4 h-4 text-brand-purple" />
                  Delivery Address
                </label>
                <motion.div
                  animate={{ scale: focusedField === "address" ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                    className="w-full p-3 rounded-xl border-2 border-purple-200/50 focus:border-brand-purple focus:ring-brand-purple transition-all duration-300 bg-white/50 focus:bg-white resize-none"
                  />
                </motion.div>
              </motion.div>

              {/* Order Notes Textarea */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="notes" className="text-base font-semibold mb-2 block text-gray-800">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  placeholder="Any special instructions..."
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-purple-200/50 focus:border-brand-purple focus:ring-brand-purple transition-all duration-300 bg-white/50 focus:bg-white resize-none"
                />
              </motion.div>

              {/* Order Summary (Now *inside* the card) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-2xl border-2 border-purple-200/50"
              >
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h3>
                <div className="space-y-2 mb-4">
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

              {/* Place Order Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-gray-400"
                >
                  {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              </motion.div>
              {cartItems.length === 0 && (
                <p className="text-center text-red-500 mt-2">Your cart is empty.</p>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CheckoutPage;