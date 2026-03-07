import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

function ProductCard({ product, style }) {
  const { addToCart, isLoading: isCartLoading } = useCart();
  
  // fetch image URL from product data
  const imageUrl = product.imageUrl;
  
  const rating = product.rating || 4.0;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 opacity-0 animate-fade-in-up"
      style={style} 
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={imageUrl} alt={product.name} />
        <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">{Number(rating).toFixed(1)} ★</span>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-brand-purple">${product.price}</span>
          <button 
            onClick={() => addToCart(product.id)}
            disabled={isCartLoading}
            className="flex items-center justify-center px-5 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-full transition-all duration-150 shadow-md hover:shadow-lg disabled:bg-gray-400 active:scale-95"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;