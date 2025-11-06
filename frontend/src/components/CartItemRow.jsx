import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'; 

function CartItemRow({ item, isLoading, removeFromCart, updateQuantity }) {
  // UUse imageUrl from product data or a placeholder
  const imageUrl = item.product.imageUrl || `https://placehold.co/100x100/E9D5FF/6B21A8?text=${item.product.name.charAt(0)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center space-x-4 p-4 rounded-2xl border border-purple-200/50 bg-white"
    >
      <img src={imageUrl} alt={item.product.name} className="w-20 h-20 rounded-md object-cover" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-brand-purple font-bold">${item.product.price}</p>
      </div>
      <div className="flex flex-col items-end">
        
        <div className="flex items-center border rounded-full">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-red-500"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="px-3 font-semibold">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-green-500"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        
        <button 
          onClick={() => removeFromCart(item.id)} 
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export default CartItemRow;