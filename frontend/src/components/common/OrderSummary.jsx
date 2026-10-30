import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { brandConfig } from '../../config/brandConfig';
import { TagIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

export const OrderSummary = ({ 
  className = '', 
  appliedCoupon = null,
  discountAmount = 0,
  onApplyCoupon = () => {},
  onRemoveCoupon = () => {},
  ...props 
}) => {
  const { cartItems } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const subtotal = cartItems.reduce((total, item) => {
    if (item && item.product && item.product.price) {
      return total + (item.quantity * Number(item.product.price));
    }
    return total;
  }, 0);

  const isFreeDelivery = subtotal >= brandConfig.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : (cartItems.length > 0 ? brandConfig.defaultDeliveryFee : 0);
  
  const total = Math.max(0, subtotal + delivery - discountAmount);

  const handleApply = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim().toUpperCase());
      setCouponInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-white p-5 sm:p-6 rounded-2xl border-2 border-yellow-200 ${className}`}
      {...props}
    >
      <h3 className="font-black text-lg mb-4 text-brand-dark flex items-center justify-between">
        <span>Resumo do Pedido</span>
        <span className="text-xs font-bold text-gray-500">{cartItems.length} itens</span>
      </h3>

      {/* Items list */}
      <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm py-1 border-b border-gray-50">
              <div className="flex items-center min-w-0 pr-2">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-10 h-10 object-cover rounded-lg mr-3 flex-shrink-0 border border-yellow-100"
                />
                <div className="min-w-0">
                  <div className="font-bold text-brand-dark text-xs sm:text-sm truncate">{item.product.name}</div>
                  <div className="text-gray-400 text-xs">
                    Qtd: {item.quantity} × {formatCurrency(item.product.price)}
                  </div>
                </div>
              </div>
              <span className="font-bold text-brand-dark text-xs sm:text-sm whitespace-nowrap">
                {formatCurrency(item.quantity * Number(item.product.price))}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center text-sm py-4">Sua sacola está vazia.</p>
        )}
      </div>

      {/* Coupon section */}
      <div className="my-4 pt-3 border-t border-gray-100">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-xl text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              Cupom <strong>{appliedCoupon}</strong> (-{formatCurrency(discountAmount)})
            </span>
            <button 
              type="button" 
              onClick={onRemoveCoupon}
              className="text-gray-400 hover:text-red-600 p-0.5 rounded"
              title="Remover cupom"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <TagIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Código de cupom (ex: PATTIES10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-3 py-2 text-xs font-bold bg-gray-50 border border-yellow-200 rounded-xl focus:bg-white focus:border-brand-red focus:outline-none uppercase"
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-dark font-black text-xs rounded-xl transition-colors cursor-pointer"
            >
              Aplicar
            </button>
          </div>
        )}
      </div>

      {/* Summary totals */}
      <div className="space-y-2 pt-2 border-t border-gray-100 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold text-brand-dark">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Taxa de Entrega</span>
          {isFreeDelivery ? (
            <span className="font-bold text-green-600 uppercase text-xs bg-green-100 px-2 py-0.5 rounded-full">
              Grátis
            </span>
          ) : (
            <span className="font-bold text-brand-dark">{formatCurrency(delivery)}</span>
          )}
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-700 font-bold">
            <span>Desconto</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="h-px bg-yellow-200 my-2" />
        
        <div className="flex justify-between items-center text-lg font-black text-brand-dark pt-1">
          <span>Total Final</span>
          <span className="text-2xl text-brand-red">{formatCurrency(total)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
