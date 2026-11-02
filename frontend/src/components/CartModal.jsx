import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ShoppingCartIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import CartItemRow from './CartItemRow';
import { formatCurrency } from '../utils/formatCurrency';
import { brandConfig } from '../config/brandConfig';

const Barcode = ({ className = 'h-5' }) => (
  <div
    aria-hidden="true"
    className={`w-full opacity-65 ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(to right, currentColor 0px, currentColor 2px, transparent 2px, transparent 4px, currentColor 4px, currentColor 5px, transparent 5px, transparent 8px, currentColor 8px, currentColor 11px, transparent 11px, transparent 13px, currentColor 13px, currentColor 14px, transparent 14px, transparent 17px)',
    }}
  />
);

export function CartModal() {
  const { 
    cartItems, 
    isLoading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    checkout, 
    isCartOpen,
    closeCart,
  } = useCart();

  // Filtra itens válidos com produto associado
  const validCartItems = cartItems.filter(item => item && item.product);

  const totalPrice = validCartItems.reduce((total, item) => {
    return total + (item.quantity * Number(item.product?.price || 0));
  }, 0);

  const isFreeDelivery = totalPrice >= brandConfig.freeDeliveryThreshold;
  const delivery = isFreeDelivery ? 0 : (validCartItems.length > 0 ? brandConfig.defaultDeliveryFee : 0);
  const grandTotal = totalPrice + delivery;

  const freeDeliveryProgress = Math.min(100, (totalPrice / brandConfig.freeDeliveryThreshold) * 100);
  const amountRemainingForFreeDelivery = Math.max(0, brandConfig.freeDeliveryThreshold - totalPrice);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Escuro Suave */}
          <motion.div 
            onClick={closeCart}
            className="fixed inset-0 bg-[#0E132A]/70 backdrop-blur-xs z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer Container Estilizado como Comanda Retro Patties */}
          <motion.div 
            className="fixed top-0 right-0 w-full max-w-md h-full bg-[#F3EFE6] text-[#141413] shadow-2xl z-50 flex flex-col border-l-2 border-[#141413]/25 selection:bg-[#D71920] selection:text-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
          >
            {/* 1. Header do Carrinho no Estilo Balcão Patties */}
            <div className="p-5 bg-[#141413] text-white border-b border-white/10 flex-shrink-0">
              <Barcode className="h-4 text-white/30 max-w-[160px] mb-2" />
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#FEDB00] font-bold block mb-1">
                    ★ 01 / COMANDA DE PEDIDO • PATTIES DIRECT ★
                  </span>
                  <h3 className="font-serif text-2xl text-white tracking-tight">
                    Seu Carrinho
                  </h3>
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-wider mt-0.5">
                    {validCartItems.length} {validCartItems.length === 1 ? 'item na chapa' : 'itens na chapa'}
                  </p>
                </div>

                <button 
                  onClick={closeCart}
                  aria-label="Fechar Carrinho"
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/15"
                  title="Fechar carrinho"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 2. Barra de Frete Grátis com Estética Retrô */}
            {validCartItems.length > 0 && (
              <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#141413]/15 flex-shrink-0">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    {isFreeDelivery ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 text-emerald-700" />
                        <span className="text-emerald-800 font-bold">Parabéns! Frete Grátis Liberado</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-3.5 h-3.5 text-[#D71920]" />
                        <span className="text-[#141413]/80">
                          Faltam <strong className="text-[#D71920] font-bold">{formatCurrency(amountRemainingForFreeDelivery)}</strong> p/ Frete Grátis
                        </span>
                      </>
                    )}
                  </span>
                  <span className="font-bold text-[10px] text-[#141413]/60">
                    {Math.round(freeDeliveryProgress)}%
                  </span>
                </div>
                
                <div className="w-full bg-[#141413]/10 h-2 overflow-hidden border border-[#141413]/15">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    className={`h-full transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-600' : 'bg-[#D71920]'}`}
                  />
                </div>
              </div>
            )}

            {/* Erro eventual */}
            {error && (
              <div className="m-4 p-3 bg-red-100 border border-red-300 text-[#D71920] font-mono text-xs font-bold">
                {error}
              </div>
            )}

            {/* 3. Área de Conteúdo: Lista de Itens ou Estado Vazio */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {validCartItems.length === 0 ? (
                /* Estado Vazio Harmonizado com Mascote Patties */
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-[#141413] p-2 mx-auto shadow-sm flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/patties-mascot.png" 
                      alt="Mascote Oficial Patties" 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-1">
                      ★ COMANDA VAZIA ★
                    </span>
                    <h4 className="font-serif text-2xl text-[#141413] tracking-tight mb-2">
                      Sua comanda ainda está vazia
                    </h4>
                    <p className="font-mono text-xs text-[#141413]/70 max-w-xs mx-auto leading-relaxed">
                      A chapa de ferro já está a 250°C esperando seu ultra smash burger prensado com batatinhas crocantes.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/order"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] shadow-md transition-colors cursor-pointer"
                    >
                      <span>Explorar o Cardápio</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Lista de Itens do Pedido */
                <div className="space-y-2.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#141413]/50 block font-bold mb-1">
                    Itens da Comanda na Chapa
                  </span>
                  {validCartItems.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      isLoading={isLoading}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 4. Rodapé da Comanda (Resumo Financeiro & CTA Finalizar) */}
            {validCartItems.length > 0 && (
              <div className="p-5 bg-[#FAF7F2] border-t-2 border-dashed border-[#141413]/25 space-y-3 shadow-lg flex-shrink-0">
                <div className="space-y-1.5 font-mono text-xs text-[#141413]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Taxa de Entrega</span>
                    <span>
                      {delivery === 0 ? (
                        <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                          Grátis
                        </span>
                      ) : (
                        <span className="font-bold">{formatCurrency(delivery)}</span>
                      )}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#141413]/15 flex justify-between items-center text-[#141413]">
                    <span className="font-serif text-base font-bold">Total da Comanda</span>
                    <span className="font-mono text-xl font-bold text-[#D71920]">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={checkout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Preparando Comanda...</span>
                  ) : (
                    <>
                      <span>Avançar para o Pagamento</span>
                      <span>➔</span>
                    </>
                  )}
                </button>

                <Barcode className="h-3 text-[#141413]/20 max-w-[180px] mx-auto mt-1" />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartModal;
