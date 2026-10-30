import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, FireIcon } from '@heroicons/react/24/solid';
import { formatCurrency } from '../utils/formatCurrency';

function ProductCard({ product, style }) {
  const { addToCart, isLoading: isCartLoading } = useCart();
  
  const imageUrl = product.imageUrl;
  const rating = product.rating || 4.8;

  return (
    <div 
      className="bg-white rounded-2xl shadow-md border border-yellow-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
      style={style} 
    >
      <div className="relative overflow-hidden group">
        <img 
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" 
          src={imageUrl} 
          alt={product.name} 
          loading="lazy"
        />
        
        {/* Rating badge */}
        <span className="absolute top-3 right-3 bg-brand-yellow text-brand-dark px-2.5 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
          <span>★</span> {Number(rating).toFixed(1)}
        </span>

        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-brand-red text-white px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
            <FireIcon className="w-3.5 h-3.5 text-brand-yellow" />
            Destaque
          </span>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-black text-brand-dark line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xl font-black text-brand-red">
            {formatCurrency(product.price)}
          </span>
          
          <button 
            onClick={() => addToCart(product.id)}
            disabled={isCartLoading}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-red-700 text-white text-sm font-bold rounded-full transition-all shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <ShoppingCartIcon className="h-4 w-4 text-brand-yellow" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
