import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'; 
import { formatCurrency } from '../utils/formatCurrency';

function CartItemRow({ item, isLoading, removeFromCart, updateQuantity }) {
  const imageUrl = item.product.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      className="flex items-center space-x-3.5 p-3.5 rounded-2xl border border-yellow-200/80 bg-white shadow-sm"
    >
      <img 
        src={imageUrl} 
        alt={item.product.name} 
        className="w-16 h-16 rounded-xl object-cover border border-yellow-100 flex-shrink-0" 
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-brand-dark truncate">
          {item.product.name}
        </h4>
        <p className="text-brand-red font-black text-sm">
          {formatCurrency(item.product.price)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
            disabled={isLoading}
            aria-label="Diminuir quantidade"
            className="p-1.5 text-gray-600 hover:text-brand-red disabled:opacity-50 transition-colors"
          >
            <MinusIcon className="h-3.5 w-3.5" />
          </button>
          
          <span className="px-2 font-black text-xs text-brand-dark">
            {item.quantity}
          </span>
          
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
            disabled={isLoading || item.quantity >= 10}
            aria-label="Aumentar quantidade"
            className="p-1.5 text-gray-600 hover:text-green-600 disabled:opacity-30 transition-colors"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        
        <button 
          onClick={() => removeFromCart(item.id)} 
          disabled={isLoading}
          aria-label="Remover item"
          className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default CartItemRow;
