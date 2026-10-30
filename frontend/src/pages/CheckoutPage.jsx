import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CreditCardIcon, 
  QrCodeIcon, 
  BanknotesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/solid';

import { Button } from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import { GlassCard } from '../components/common/GlassCard';
import OrderSummary from '../components/common/OrderSummary';
import { PageLayout } from '../components/layout/PageLayout';
import { CardHeader } from '../components/common/CardHeader';
import api from '../services/api';
import toast from 'react-hot-toast';

function CheckoutPage() {
  const { cartItems, isLoading, placeOrder } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "pix",
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.product.price));
  }, 0);

  const handleApplyCoupon = async (code) => {
    try {
      const response = await api.post('/orders/validate-coupon', {
        code,
        subtotal
      });
      setAppliedCoupon(response.data.code);
      setDiscountAmount(response.data.discountAmount);
      toast.success(response.data.message || 'Cupom aplicado!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Cupom inválido.';
      toast.error(msg);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success('Cupom removido.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || cartItems.length === 0) return;

    const payload = {
      ...formData,
      couponCode: appliedCoupon
    };

    try {
      await placeOrder(payload);
    } catch {
      // Error handled by CartContext toast
    }
  };
  
  const inputFields = [
    { id: "name", label: "Nome Completo", icon: UserIcon, type: "text", placeholder: "Ex: Gabriel Victor" },
    { id: "email", label: "E-mail de Contato", icon: EnvelopeIcon, type: "email", placeholder: "seu@email.com" },
    { id: "phone", label: "Telefone / WhatsApp", icon: PhoneIcon, type: "tel", placeholder: "(11) 99999-8888" },
  ];

  const paymentOptions = [
    { id: 'pix', label: 'PIX Instantâneo', icon: QrCodeIcon, badge: 'Aprovação Imediata' },
    { id: 'card', label: 'Cartão na Entrega', icon: CreditCardIcon, badge: 'Débito / Crédito' },
    { id: 'cash', label: 'Dinheiro na Entrega', icon: BanknotesIcon, badge: 'Troco se precisar' },
  ];

  return (
    <PageLayout center={false}> 
      <div className="max-w-4xl mx-auto">
        <GlassCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <form onSubmit={handleSubmit}>
            
            <CardHeader
              icon={ShoppingBagIcon}
              title="Finalizar Pedido Patties"
              description="Preencha os dados de entrega para enviarmos quentinho direto da chapa"
            />
            
            <div className="p-6 sm:p-8">
              <div className="space-y-6">

                {/* Customer info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inputFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={field.id === 'name' ? 'md:col-span-2' : ''}
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
                </div>

                {/* Address */}
                <FormInput
                  as="textarea"
                  id="address"
                  label="Endereço de Entrega Completo"
                  icon={MapPinIcon}
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, Número, Bairro, Complemento, Cidade e CEP"
                />

                {/* Order Notes */}
                <FormInput
                  as="textarea"
                  id="notes"
                  label="Observações do Pedido (Opcional)"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Ponto da carne, tirar cebola, interfone 42..."
                />

                {/* Payment Method selector */}
                <div>
                  <label className="text-xs sm:text-sm font-black uppercase tracking-wider block mb-2 text-neutral-800">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentOptions.map((opt) => {
                      const isSelected = formData.paymentMethod === opt.id;
                      const Icon = opt.icon;

                      return (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: opt.id })}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-patties-red bg-red-50/50 text-patties-red shadow-soft font-black'
                              : 'border-neutral-200/80 bg-white hover:border-neutral-300 text-neutral-700 font-bold'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-patties-red' : 'text-neutral-400'}`} />
                          <span className="text-xs sm:text-sm uppercase">{opt.label}</span>
                          <span className="text-[10px] text-neutral-400 uppercase mt-0.5">{opt.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary embedded */}
                <div className="pt-2">
                  <OrderSummary
                    appliedCoupon={appliedCoupon}
                    discountAmount={discountAmount}
                    onApplyCoupon={handleApplyCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || cartItems.length === 0}
                  >
                    {isLoading ? 'Transmitindo Pedido para a Chapa...' : 'Confirmar e Enviar Pedido'}
                  </Button>
                </div>

              </div>
            </div>
          </form>
        </GlassCard>
      </div>
    </PageLayout>
  );
}

export default CheckoutPage;
