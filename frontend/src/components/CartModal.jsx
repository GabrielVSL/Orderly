import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingBagIcon, SparklesIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import CartItemRow from './CartItemRow';
import { formatCurrency } from '../utils/formatCurrency';
import { brandConfig } from '../config/brandConfig';

const UPSELL_ITEMS = [
  {
    id: 'upsell-skinny',
    name: 'Skinny Classic Fries',
    price: 16.00,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2023/05/1-skinny-classic-fries-1.jpg',
  },
  {
    id: 'upsell-refresco',
    name: 'Refresco Groselha Hibiscus',
    price: 12.00,
    imageUrl: 'https://pattiesburger.com/wp-content/uploads/2024/09/refresco-hibiscus.jpg',
  }
];

function CartModal() {
  const { 
    cartItems, 
    isLoading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    checkout, 
    isCartOpen,
    closeCart,
    addToCart
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
          {/* Backdrop */}
          <motion.div 
            onClick={closeCart}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer Container */}
          <motion.div 
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#F8F5EE] shadow-floating z-50 flex flex-col border-l border-neutral-200/80"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-white border-b border-neutral-200/80">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-patties-red text-white rounded-xl shadow-badge-red">
                  <ShoppingBagIcon className="h-5 w-5 stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">
                    Sua Sacola Patties
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
                  </p>
                </div>
              </div>
              <button 
                onClick={closeCart}
                aria-label="Fechar Carrinho"
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {cartItems.length > 0 && (
              <div className="px-5 py-3.5 bg-white border-b border-neutral-100">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    {isFreeDelivery ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Parabéns! Você ganhou Frete Grátis</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 text-patties-red animate-pulse" />
                        <span className="text-neutral-700">Falta <strong>{formatCurrency(amountRemainingForFreeDelivery)}</strong> para Frete Grátis</span>
                      </>
                    )}
                  </span>
                  <span className={isFreeDelivery ? "text-emerald-600" : "text-patties-red"}>
                    {Math.round(freeDeliveryProgress)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-500' : 'bg-patties-red'}`}
                  />
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="m-4 p-3 bg-red-50 border border-red-200 text-patties-red rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <span className="text-5xl mb-3 block">🍟</span>
                  <h4 className="text-xl font-black text-neutral-900 uppercase tracking-tight mb-2">
                    Sua sacola está vazia
                  </h4>
                  <p className="text-sm font-medium mb-6 text-neutral-500 max-w-xs">
                    Que tal experimentar o autêntico ultra smash burger feito na chapa de ferro quente?
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 bg-patties-yellow hover:bg-patties-yellow-warm text-neutral-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-soft hover:shadow-elevated transition-all cursor-pointer"
                  >
                    Ver Cardápio
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {cartItems.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        isLoading={isLoading}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                      />
                    ))}
                  </div>

                  {/* 1-Click Upsell Carousel */}
                  <div className="pt-4 mt-4 border-t border-neutral-200/80">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 block mb-2.5">
                      🍟 Complete seu lanche
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {UPSELL_ITEMS.map((up) => (
                        <div 
                          key={up.id}
                          className="p-2.5 bg-white rounded-xl border border-neutral-200/80 flex flex-col justify-between shadow-soft hover:shadow-card transition-all"
                        >
                          <img 
                            src={up.imageUrl} 
                            alt={up.name} 
                            className="w-full h-20 rounded-lg object-cover bg-[#F8F5EE] mb-2" 
                          />
                          <h5 className="font-black text-xs text-neutral-900 uppercase truncate">
                            {up.name}
                          </h5>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-bold text-patties-red">
                              {formatCurrency(up.price)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                // Encontra o ID real pelo nome ou similar
                                const matched = cartItems[0]?.product?.id;
                                if (matched) addToCart(matched, 1);
                              }}
                              className="p-1 bg-patties-yellow hover:bg-patties-yellow-warm rounded-md text-neutral-900 transition-colors cursor-pointer"
                              title="Adicionar"
                            >
                              <PlusIcon className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-neutral-200/80 space-y-3.5 shadow-floating">
                <div className="space-y-1.5 text-sm font-bold">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalPrice)}</span>
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

                  <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-neutral-900">
                    <span className="text-base font-black uppercase tracking-tight">Total</span>
                    <span className="text-2xl font-black text-patties-red">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={checkout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-patties-red hover:bg-patties-red-dark text-white rounded-xl font-black text-base uppercase tracking-wider shadow-badge-red hover:shadow-elevated transition-all disabled:bg-neutral-300 disabled:shadow-none cursor-pointer"
                >
                  {isLoading ? 'Carregando...' : 'Avançar para o Pagamento'}
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
