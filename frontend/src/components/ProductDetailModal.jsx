import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, MinusIcon, CheckIcon, FireIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';

export const ProductDetailModal = ({ product, isOpen, onClose, allProducts = [] }) => {
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedGrill, setSelectedGrill] = useState('padrão');
  const [extraSauce, setExtraSauce] = useState(false);
  const [noOnion, setNoOnion] = useState(false);
  const [noPickles, setNoPickles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reseta os seletores sempre que abrir ou trocar de produto (REV-01)
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedGrill('padrão');
      setExtraSauce(false);
      setNoOnion(false);
      setNoPickles(false);
    }
  }, [product?.id, isOpen]);

  if (!product) return null;

  const extraPrice = extraSauce ? 5.00 : 0;
  const unitPrice = Number(product.price) + extraPrice;
  const totalPrice = unitPrice * quantity;

  // Localiza produto oficial de molho verde caso selecionado
  const sauceProduct = allProducts?.find((p) => p.name.toLowerCase().includes('nhonhonese'));

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    const isCustomizable =
      product.category === 'lanches' || product.category === '4up' || product.category === 'combos';

    const notesList = [];
    if (isCustomizable) {
      if (selectedGrill === 'bem-tostado') notesList.push('Extra Crocante');
      if (noOnion) notesList.push('Sem Cebola');
      if (noPickles) notesList.push('Sem Picles');
    }
    const itemNotes = notesList.length > 0 ? notesList.join(' • ') : null;

    try {
      // 1. Adiciona o burger principal com as customizações selecionadas
      await addToCart(product.id, quantity, !extraSauce, itemNotes);

      // 2. Se selecionou pote extra de molho, adiciona o produto de verdade (+R$ 5,00) ao carrinho
      if (extraSauce && sauceProduct) {
        await addToCart(sauceProduct.id, quantity, true);
      }

      onClose();
    } catch {
      // Erro tratado com toast no CartContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl border border-neutral-200/80 shadow-floating overflow-hidden z-10 my-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full text-neutral-700 hover:text-neutral-950 border border-neutral-200/80 shadow-soft transition-all cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Product Image Banner */}
            <div className="relative h-64 sm:h-72 bg-[#F8F5EE] overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Tag Destaque */}
              {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-patties-red text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-badge-red flex items-center gap-1">
                  <FireIcon className="w-3.5 h-3.5 text-patties-yellow" />
                  Destaque da Casa
                </span>
              )}

              {/* Rating Stamp */}
              <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-black px-3 py-1 rounded-lg border border-neutral-200/80 shadow-soft flex items-center gap-1">
                <span className="text-amber-500">★</span> {Number(product.rating || 4.9).toFixed(1)} / 5.0
              </span>
            </div>

            {/* Details Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-280px)] overflow-y-auto">
              <div>
                <div className="flex justify-between items-baseline gap-4 mb-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                    {product.name}
                  </h3>
                  <span className="text-2xl font-black text-patties-red whitespace-nowrap">
                    {formatCurrency(unitPrice)}
                  </span>
                </div>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Customization Options (Only for burgers and combos) */}
              {(product.category === 'lanches' || product.category === '4up' || product.category === 'combos') && (
                <div className="space-y-4 pt-4 border-t border-neutral-100">
                  <h4 className="font-black text-sm uppercase tracking-wider text-neutral-900">
                    Personalização do Smash
                  </h4>

                  {/* Ponto da chapa */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-500 block">Ponto da Carne:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGrill('padrão')}
                        className={`p-3 rounded-xl border text-xs font-black uppercase tracking-wider text-left transition-all ${
                          selectedGrill === 'padrão'
                            ? 'border-patties-red bg-red-50/50 text-patties-red'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        ✓ Crostinha Tradicional
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGrill('bem-tostado')}
                        className={`p-3 rounded-xl border text-xs font-black uppercase tracking-wider text-left transition-all ${
                          selectedGrill === 'bem-tostado'
                            ? 'border-patties-red bg-red-50/50 text-patties-red'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        ⚡ Extra Crocante
                      </button>
                    </div>
                  </div>

                  {/* Retirar ingredientes */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-neutral-500 block">Remover Ingredientes:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setNoOnion(!noOnion)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          noOnion
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {noOnion ? '✕ Sem Cebola' : 'Tirar Cebola'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNoPickles(!noPickles)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          noPickles
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {noPickles ? '✕ Sem Picles' : 'Tirar Picles'}
                      </button>
                    </div>
                  </div>

                  {/* Adicional de molho */}
                  <div className="pt-2">
                    <label 
                      onClick={() => setExtraSauce(!extraSauce)}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${extraSauce ? 'bg-patties-red border-patties-red text-white' : 'border-neutral-300'}`}>
                          {extraSauce && <CheckIcon className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-bold text-neutral-800">
                          Adicionar Pote de Nhonhonese Verde (50ml)
                        </span>
                      </div>
                      <span className="text-xs font-black text-patties-red">+ R$ 5,00</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Quantity + Add to cart) */}
            <div className="p-5 sm:p-6 bg-[#F8F5EE] border-t border-neutral-200/80 flex items-center justify-between gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white shadow-soft">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-neutral-600 hover:text-patties-red transition-colors cursor-pointer"
                  aria-label="Diminuir"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-3 font-black text-sm text-neutral-900 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-2.5 text-neutral-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  aria-label="Aumentar"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-patties-red hover:bg-patties-red-dark text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-badge-red hover:shadow-elevated transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Adicionando...' : 'Adicionar ao Carrinho'}</span>
                <span>•</span>
                <span>{formatCurrency(totalPrice)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
