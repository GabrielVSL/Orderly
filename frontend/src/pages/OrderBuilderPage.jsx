import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckIcon, 
  PlusIcon, 
  ShoppingBagIcon, 
  EyeIcon,
  ForwardIcon
} from '@heroicons/react/24/solid';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import ProductDetailModal from '../components/ProductDetailModal';
import ProductSkeleton from '../components/common/ProductSkeleton';

const STEPS = [
  {
    number: 1,
    id: 'smash',
    title: 'Escolha seu Burger',
    subtitle: 'Nossos clássicos smash prensados na chapa de ferro fundido a 250°C.',
    categories: ['lanches', '4up', 'combos'],
    tag: '01 / O SMASH PRINCIPAL'
  },
  {
    number: 2,
    id: 'sides',
    title: 'Acompanhamentos',
    subtitle: 'Batatas skinny ultra finas e crocantes ou bites de frango (opcional).',
    categories: ['batatas', 'frango'],
    tag: '02 / BATATAS & BITES'
  },
  {
    number: 3,
    id: 'drinks',
    title: 'Bebidas & Shakes',
    subtitle: 'Refrescos artesanais de groselha e tamarindo ou milkshakes batidos na hora (opcional).',
    categories: ['bebidas', 'sobremesas'],
    tag: '03 / BEBIDAS & SHAKES'
  }
];

export function OrderBuilderPage() {
  const [searchParams] = useSearchParams();
  const initialStep = Math.min(Math.max(parseInt(searchParams.get('step') || '0', 10) || 0, 0), STEPS.length - 1);

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [detailProduct, setDetailProduct] = useState(null);
  const navigate = useNavigate();

  const { products, isLoading, error } = useProducts();
  const { cartItems, addToCart, openCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const currentStep = STEPS[currentStepIndex];

  // Filtra itens da etapa ativa
  const stepProducts = products.filter(p => currentStep.categories.includes(p.category));

  // Cálculo do subtotal atual
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.product?.price || 0) * item.quantity), 
    0
  );
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getProductCartCount = (productId) => {
    const item = cartItems.find(ci => ci.productId === productId || ci.product?.id === productId);
    return item ? item.quantity : 0;
  };

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/checkout');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] pb-32">
      
      {/* Clean Hairline Stepper Header */}
      <div className="bg-[#EAE5DC]/95 backdrop-blur-md border-b border-[#141413]/15 sticky top-[52px] z-30">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-3.5">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 divide-x divide-[#141413]/15">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`text-left transition-opacity cursor-pointer ${
                    idx > 0 ? 'pl-3 sm:pl-6' : ''
                  } ${isActive ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}
                >
                  <span className={`block text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] ${
                    isActive ? 'text-[#D71920] font-bold' : 'text-[#141413]'
                  }`}>
                    {isPast ? `✓ 0${step.number}` : `PASSO 0${step.number}`}
                  </span>
                  <h4 className="font-serif text-sm sm:text-lg text-[#141413] truncate mt-0.5">
                    {step.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-5 sm:px-10 pt-10 sm:pt-14">
        
        {/* Step Intro Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#141413]/20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D71920] font-bold block mb-2">
              {currentStep.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#141413] tracking-[-0.02em]">
              {currentStep.title}
            </h1>
            <p className="text-[#141413]/70 text-sm sm:text-base mt-1.5">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Quick Skip Button for Steps 2 and 3 */}
          {currentStepIndex > 0 && (
            <button
              onClick={handleNextStep}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 border border-[#141413]/30 bg-[#F3EFE6] hover:bg-[#141413] text-[#141413] hover:text-white text-[10px] font-mono font-bold uppercase tracking-[0.18em] transition-colors cursor-pointer"
            >
              <span>{currentStepIndex === 1 ? 'Pular Acompanhamentos' : 'Pular para Checkout'}</span>
              <ForwardIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-[#FDF2F2] border border-[#D71920]/30 text-[#D71920] p-6 text-center my-6">
            <p className="font-mono font-bold text-xs uppercase tracking-widest">Não foi possível carregar os itens</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Products Grid for this Step */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : stepProducts.length > 0 ? (
            stepProducts.map((product) => {
              const inCartCount = getProductCartCount(product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-[#F3EFE6] border border-[#141413]/15 flex flex-col justify-between overflow-hidden group transition-colors hover:border-[#141413]/35"
                >
                  {/* Product Image & Minimal Tags */}
                  <div className="relative aspect-[4/3] bg-[#141413] overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {product.isFeatured && (
                      <span className="absolute top-3 left-3 bg-[#141413] text-[#F5F1E8] font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1">
                        Clássico da Casa
                      </span>
                    )}

                    {inCartCount > 0 && (
                      <span className="absolute top-3 right-3 bg-[#D71920] text-white font-mono font-bold text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" />
                        {inCartCount} na comanda
                      </span>
                    )}

                    <button
                      onClick={() => setDetailProduct(product)}
                      className="absolute bottom-3 right-3 bg-[#F3EFE6]/95 hover:bg-white text-[#141413] p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Ver detalhes e ingredientes"
                    >
                      <EyeIcon className="w-4 h-4 text-[#141413]" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-[#141413] leading-snug mb-1.5">
                        {product.name}
                      </h3>
                      
                      <p className="text-[#141413]/65 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-5">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#141413]/15 flex items-center justify-between">
                      <span className="text-lg font-mono font-bold text-[#141413]">
                        {formatCurrency(product.price)}
                      </span>

                      <button
                        onClick={() => addToCart(product.id, 1, false)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 font-mono font-bold text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer ${
                          inCartCount > 0
                            ? 'bg-[#141413] text-[#FEDB00] hover:bg-black'
                            : 'bg-[#D71920] hover:bg-[#b8141a] text-white'
                        }`}
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>{inCartCount > 0 ? 'Adicionar +1' : 'Selecionar'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center border border-[#141413]/15 bg-[#F3EFE6]">
              <p className="text-[#141413]/60 font-mono uppercase text-xs tracking-widest">
                Nenhum item disponível nesta etapa.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* Floating Bottom Order Tray */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#141413] text-[#F5F1E8] border-t border-white/15 py-4 px-5 sm:px-10">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
            <button 
              onClick={openCart}
              className="px-3.5 py-2 border border-white/20 hover:border-white/50 transition-colors cursor-pointer flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em]"
              title="Abrir comanda completa"
            >
              <ShoppingBagIcon className="w-4 h-4 text-[#FEDB00]" />
              <span>Comanda ({totalItemsCount})</span>
            </button>

            <div>
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                Subtotal Atual
              </div>
              <div className="text-lg sm:text-xl font-mono font-bold text-white leading-tight">
                {formatCurrency(subtotal)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-3 border border-white/20 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-[0.18em] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeftIcon className="w-3 h-3" />
                <span>Voltar</span>
              </button>
            )}

            {currentStepIndex < STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#D71920] hover:bg-[#b8141a] text-white font-mono font-bold text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                <span>Próxima Etapa</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FEDB00] hover:bg-[#f5d000] text-[#141413] font-mono font-bold text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                <span>Ir para o Checkout</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Quick-View Product Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
      />

    </div>
  );
}

export default OrderBuilderPage;
