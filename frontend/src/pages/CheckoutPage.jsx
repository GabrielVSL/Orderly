import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { GlassCard } from '../components/common/GlassCard';
import OrderSummary from '../components/common/OrderSummary';
import { PageLayout } from '../components/layout/PageLayout';
import { CardHeader } from '../components/common/CardHeader';

function CheckoutPage() {
  const { cartItems, isLoading, placeOrder } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "", 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    placeOrder();
  };
  
  const inputFields = [
    { id: "name", label: "Full Name", icon: UserIcon, type: "text", placeholder: "John Doe" },
    { id: "email", label: "Email", icon: EnvelopeIcon, type: "email", placeholder: "john@example.com" },
    { id: "phone", label: "Phone Number", icon: PhoneIcon, type: "tel", placeholder: "+1 (555) 000-0000" },
  ];

  return (
    <PageLayout center={false}> 
      
      <GlassCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto" 
      >
        <form onSubmit={handleSubmit}>
          
          <CardHeader
            icon={ShoppingCartIcon}
            title="Checkout"
            description="Complete your order details"
          />
          
          <div className="p-8">
            <div className="space-y-6">

              {inputFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FormInput
                    id={field.id}
                    label={field.label}
                    icon={field.icon}
                    type={field.type}
                    required
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    placeholder={field.placeholder}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormInput
                  as="textarea"
                  id="address"
                  label="Delivery Address"
                  icon={MapPinIcon}
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormInput
                  as="textarea"
                  id="notes"
                  label="Order Notes (Optional)"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions..."
                />
              </motion.div>

              <OrderSummary />

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || cartItems.length === 0}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>

              {cartItems.length === 0 && (
                <p className="text-center text-red-500 mt-2">Your cart is empty.</p>
              )}
            </div>
          </div>
        </form>
      </GlassCard>
    </PageLayout>
  );
}

export default CheckoutPage;