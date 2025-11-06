import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const { cartItems, openCart } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-brand-light sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:ph-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex-shrink-0 flex items-center text-3xl font-bold text-gray-900">
            <SparklesIcon className="h-8 w-8 text-brand-purple mr-2" />
            Orderly
          </Link>

          <div className="flex items-center">
            <button 
              onClick={openCart} 
              className="relative p-2 text-gray-600 hover:text-brand-purple rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;