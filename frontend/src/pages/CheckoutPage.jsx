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
    { id: 'pix', label: 'PIX (Aprovação Instantânea)', icon: QrCodeIcon, badge: 'Mais Rápido' },
    { id: 'card', label: 'Cartão na Entrega (Débito/Crédito)', icon: CreditCardIcon },
    { id: 'cash', label: 'Dinheiro na Entrega', icon: BanknotesIcon },
  ];

  return (
    <PageLayout center={false}> 
      <GlassCard
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto" 
      >
        <form onSubmit={handleSubmit}>
          
          <CardHeader
            icon={ShoppingBagIcon}
            title="Finalizar Pedido"
            description="Preencha seus dados de entrega e forma de pagamento"
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
                <label className="text-sm font-bold block mb-2 text-brand-dark">
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
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-brand-red bg-red-50 text-brand-red shadow-sm'
                            : 'border-yellow-200 bg-white hover:bg-yellow-50/50 text-gray-700'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-1.5 ${isSelected ? 'text-brand-red' : 'text-brand-yellow'}`} />
                        <span className="text-xs font-black">{opt.label}</span>
                        {opt.badge && (
                          <span className="text-[10px] font-bold bg-brand-yellow text-brand-dark px-1.5 py-0.2 rounded mt-1">
                            {opt.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary with coupon */}
              <OrderSummary 
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || cartItems.length === 0}
              >
                {isLoading ? 'Confirmando Pedido...' : 'Confirmar e Fazer Pedido'}
              </Button>

              {cartItems.length === 0 && (
                <p className="text-center text-red-500 font-bold text-sm mt-2">
                  Sua sacola está vazia. Adicione itens antes de finalizar.
                </p>
              )}
            </div>
          </div>
        </form>
      </GlassCard>
    </PageLayout>
  );
}

export default CheckoutPage;
