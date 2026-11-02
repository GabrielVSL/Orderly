import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid'; 
import { formatCurrency } from '../utils/formatCurrency';

function CartItemRow({ item, isLoading, removeFromCart, updateQuantity }) {
  if (!item || !item.product) return null;

  const product = item.product;
  const imageUrl = product.imageUrl || 'https://pattiesburger.com/wp-content/uploads/2022/04/ORIGINAL.jpg';
  const productName = product.name || 'Item do Cardápio';
  const productPrice = Number(product.price) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-3 p-3 bg-white border border-[#141413]/20 shadow-xs hover:border-[#141413]/50 transition-colors"
    >
      {/* Imagem do Produto em Moldura Retangular Retrô */}
      <div className="w-14 h-14 bg-[#FAF7F2] border border-[#141413]/15 flex-shrink-0 overflow-hidden p-1 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={productName} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://pattiesburger.com/wp-content/uploads/2022/04/ORIGINAL.jpg';
          }}
        />
      </div>
      
      {/* Detalhes do Produto */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-bold text-sm text-[#141413] truncate leading-tight">
          {productName}
        </h4>
        {item.notes && (
          <span className="font-mono text-[9px] text-[#D71920] font-bold block truncate mt-0.5">
            ★ {item.notes}
          </span>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-xs font-bold text-[#D71920]">
            {formatCurrency(productPrice)}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#141413]/40">
            / un
          </span>
        </div>
      </div>

      {/* Controles de Quantidade & Lixeira */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center border border-[#141413]/25 bg-[#FAF7F2]">
          <button 
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
            disabled={isLoading}
            aria-label="Diminuir quantidade"
            className="w-6 h-6 flex items-center justify-center text-[#141413] hover:bg-[#141413] hover:text-[#FEDB00] disabled:opacity-30 transition-colors cursor-pointer text-xs font-bold"
          >
            <MinusIcon className="h-3 w-3" />
          </button>
          
          <span className="font-mono text-xs font-bold w-6 text-center text-[#141413]">
            {item.quantity}
          </span>

          <button 
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
            disabled={isLoading}
            aria-label="Aumentar quantidade"
            className="w-6 h-6 flex items-center justify-center text-[#141413] hover:bg-[#141413] hover:text-[#FEDB00] disabled:opacity-30 transition-colors cursor-pointer text-xs font-bold"
          >
            <PlusIcon className="h-3 w-3" />
          </button>
        </div>

        <button 
          type="button"
          onClick={() => removeFromCart(item.id)} 
          disabled={isLoading}
          aria-label="Remover item"
          className="p-1.5 text-[#141413]/40 hover:text-[#D71920] transition-colors cursor-pointer"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default CartItemRow;
