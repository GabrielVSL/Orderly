import React from 'react';
import { useCart } from '../context/CartContext';
import { PlusIcon, FireIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';
import { motion } from 'framer-motion';

export function ProductCard({ product, onOpenDetail, style, isFeature = false }) {
  const { addToCart, isLoading: isCartLoading } = useCart();
  
  const imageUrl = product.imageUrl;
  const rating = product.rating || 4.9;

  // Handle Quick Add directly
  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  // Se for um Feature Card (largura dupla com narrativa editorial)
  if (isFeature) {
    return (
      <div 
        onClick={() => onOpenDetail?.(product)}
        className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col md:flex-row"
        style={style}
      >
        {/* Large Feature Image */}
        <div className="relative md:w-1/2 bg-[#F8F5EE] overflow-hidden min-h-[240px] md:min-h-[280px]">
          <img 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            src={imageUrl} 
            alt={product.name} 
            loading="lazy"
          />
          <span className="absolute top-3.5 left-3.5 bg-patties-red text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-badge-red flex items-center gap-1">
            <FireIcon className="w-3.5 h-3.5 text-patties-yellow" />
            Top Escolha Patties
          </span>
        </div>

        {/* Feature Information */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-patties-red">
                Especial da Chapa
              </span>
              <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                <span className="text-amber-500">★</span> {Number(rating).toFixed(1)}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight mb-2 group-hover:text-patties-red transition-colors">
              {product.name}
            </h3>
            
            <p className="text-neutral-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Valor
              </span>
              <span className="text-2xl font-black text-patties-red tracking-tight">
                {formatCurrency(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isCartLoading}
                aria-label="Adicionar à sacola"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-patties-red hover:bg-patties-red-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-badge-red hover:shadow-elevated transition-all cursor-pointer"
              >
                <PlusIcon className="h-4 w-4 stroke-[3]" />
                Pedir Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Editorial Card (otimizado sem layout thrashing)
  return (
    <div 
      onClick={() => onOpenDetail?.(product)}
      className="bg-white rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer group"
      style={style} 
    >
      {/* Product Image Container */}
      <div className="relative bg-[#F8F5EE] overflow-hidden border-b border-neutral-100">
        <img 
          className="w-full h-52 sm:h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
          src={imageUrl} 
          alt={product.name} 
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-200/80 text-xs font-black shadow-soft flex items-center gap-1">
          <span className="text-amber-500">★</span> {Number(rating).toFixed(1)}
        </span>

        {/* Featured Badge */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-patties-red text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-badge-red flex items-center gap-1">
            <FireIcon className="w-3 h-3 text-patties-yellow" />
            Destaque
          </span>
        )}
      </div>
      
      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-neutral-900 uppercase tracking-tight line-clamp-1 mb-1.5 group-hover:text-patties-red transition-colors">
            {product.name}
          </h3>
          <p className="text-neutral-500 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 -mb-1">
              Preço
            </span>
            <span className="text-xl font-black text-patties-red tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <button 
            type="button"
            onClick={handleQuickAdd}
            disabled={isCartLoading}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className="flex items-center justify-center gap-1 px-3.5 py-2 bg-patties-yellow hover:bg-patties-yellow-warm text-neutral-900 text-xs font-black uppercase tracking-wider rounded-xl shadow-soft hover:shadow-elevated active:scale-95 transition-all cursor-pointer"
          >
            <PlusIcon className="h-3.5 w-3.5 stroke-[3]" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
