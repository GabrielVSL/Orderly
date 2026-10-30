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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-card ${className}`}
      {...props}
    >
      {/* Receipt Title */}
      <div className="pb-3.5 border-b border-dashed border-neutral-200 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-patties-red block">
            ★ PATTIES DIRECT ★
          </span>
          <h3 className="font-black text-xl text-neutral-900 uppercase tracking-tight">
            Resumo da Comanda
          </h3>
        </div>
        <span className="text-xs font-black bg-[#F8F5EE] text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200/80 shadow-soft">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {/* Items list */}
      <div className="space-y-2.5 max-h-52 overflow-y-auto mb-4 pr-1">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm py-1.5 border-b border-neutral-50">
              <div className="flex items-center min-w-0 pr-2">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-10 h-10 rounded-lg object-cover border border-neutral-100 mr-2.5 flex-shrink-0 bg-[#F8F5EE]"
                />
                <div className="truncate">
                  <p className="font-black text-neutral-900 uppercase text-xs truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-bold text-neutral-400">
                    Qtd: {item.quantity} × {formatCurrency(item.product.price)}
                  </p>
                </div>
              </div>
              <span className="font-black text-neutral-900 text-sm flex-shrink-0">
                {formatCurrency(item.quantity * Number(item.product.price))}
              </span>
            </div>
          ))
        ) : (
          <p className="text-neutral-400 text-xs py-2 text-center font-bold">Nenhum item na sacola.</p>
        )}
      </div>

      {/* Coupon section */}
      <div className="pt-2 pb-4 border-b border-dashed border-neutral-200 mb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-black uppercase text-emerald-900 block">
                  Cupom {appliedCoupon} Ativo
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  Desconto de {formatCurrency(discountAmount)}
                </span>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-neutral-400 hover:text-patties-red p-1 cursor-pointer"
              aria-label="Remover cupom"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400">
                <TagIcon className="h-4 w-4 text-patties-red" />
              </div>
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Código do cupom (ex: PATTIES10)"
                className="w-full pl-8 pr-2 py-2 bg-neutral-50 border border-neutral-200/80 focus:border-patties-red rounded-xl text-xs font-black uppercase placeholder:normal-case placeholder:font-normal focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!couponInput.trim()}
              className="px-4 py-2 bg-patties-yellow hover:bg-patties-yellow-warm disabled:bg-neutral-200 text-neutral-900 text-xs font-black uppercase rounded-xl shadow-soft transition-all cursor-pointer"
            >
              Aplicar
            </button>
          </form>
        )}
        
        {/* Cupons disponíveis */}
        {!appliedCoupon && (
          <div className="mt-2 text-[10px] text-neutral-500 font-bold flex flex-wrap gap-1.5">
            <span>Dica: use o cupom</span>
            <button 
              type="button" 
              onClick={() => onApplyCoupon('PATTIES10')} 
              className="text-patties-red font-black underline hover:text-patties-red-dark cursor-pointer"
            >
              PATTIES10
            </button>
          </div>
        )}
      </div>

      {/* Financials Breakdown */}
      <div className="space-y-2 text-xs sm:text-sm font-bold">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-neutral-500">
          <span>Taxa de Entrega</span>
          <span>
            {delivery === 0 ? (
              <span className="text-emerald-700 font-black uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded">
                Grátis
              </span>
            ) : (
              formatCurrency(delivery)
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-black">
            <span>Desconto ({appliedCoupon})</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="pt-3 border-t border-neutral-200 flex justify-between items-center text-neutral-900">
          <span className="text-base font-black uppercase tracking-tight">Valor Total</span>
          <span className="text-2xl font-black text-patties-red tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
