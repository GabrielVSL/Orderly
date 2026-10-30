import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingBagIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import CartItemRow from './CartItemRow';
import { formatCurrency } from '../utils/formatCurrency';
import { brandConfig } from '../config/brandConfig';

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
    return total + (item.quantity * Number(item.product.price));
  }, 0);

  const isFreeDelivery = totalPrice >= brandConfig.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : (cartItems.length > 0 ? brandConfig.defaultDeliveryFee : 0);
  const grandTotal = totalPrice + delivery;

  const freeDeliveryProgress = Math.min(100, (totalPrice / brandConfig.freeDeliveryThreshold) * 100);
  const amountRemainingForFreeDelivery = Math.max(0, brandConfig.freeDeliveryThreshold - totalPrice);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div 
            className="fixed top-0 right-0 w-full max-w-md h-full bg-brand-cream shadow-2xl z-50 flex flex-col border-l-2 border-yellow-300"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-white border-b border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-brand-red text-brand-yellow rounded-xl">
                  <ShoppingBagIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-brand-dark">Sua Sacola</h3>
                  <p className="text-xs text-gray-500 font-bold">
                    {cartItems.length} {cartItems.length === 1 ? 'item adicionado' : 'itens adicionados'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={closeCart} 
                className="p-2 text-gray-400 hover:text-brand-dark rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fechar sacola"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Free shipping bar */}
            {cartItems.length > 0 && (
              <div className="bg-yellow-50 px-5 py-3 border-b border-yellow-200">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  {isFreeDelivery ? (
                    <span className="text-green-700 flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 inline" />
                      Parabéns! Você ganhou Frete Grátis!
                    </span>
                  ) : (
                    <span className="text-brand-dark">
                      Adicione mais <strong className="text-brand-red">{formatCurrency(amountRemainingForFreeDelivery)}</strong> para ter <strong>Frete Grátis</strong>
                    </span>
                  )}
                  <span className="text-gray-500">{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isFreeDelivery ? 'bg-green-500' : 'bg-brand-red'}`}
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading && cartItems.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-medium">
                  Carregando sacola...
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium">
                  Erro: {error}
                </div>
              )}
              
              {cartItems.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-20 px-6">
                  <span className="text-6xl block mb-4">🍔</span>
                  <h4 className="text-lg font-black text-brand-dark mb-1">
                    Sua sacola está vazia
                  </h4>
                  <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
                    Que tal experimentar o nosso Original Patties Burger com batatinhas crocantes?
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark font-black text-sm rounded-full transition-all cursor-pointer shadow-sm"
                  >
                    Ver Cardápio
                  </button>
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

            {/* Footer Summary & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-yellow-200 bg-white">
                <div className="space-y-2 mb-4 text-sm font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-brand-dark">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de Entrega</span>
                    {isFreeDelivery ? (
                      <span className="text-green-600 font-bold uppercase text-xs bg-green-100 px-2 py-0.5 rounded-full">
                        Grátis
                      </span>
                    ) : (
                      <span className="font-bold text-brand-dark">{formatCurrency(delivery)}</span>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-base font-black text-brand-dark">
                    <span>Total Estimado</span>
                    <span className="text-xl text-brand-red">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={checkout} 
                  disabled={isLoading}
                  className="w-full py-4 bg-brand-red hover:bg-red-700 text-white rounded-2xl font-black text-base transition-all shadow-lg shadow-red-500/20 active:scale-98 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-5 h-5 text-brand-yellow" />
                  {isLoading ? 'Aguarde...' : 'Avançar para o Pagamento'}
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
