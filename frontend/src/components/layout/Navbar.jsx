import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, FireIcon, ClockIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { brandConfig } from '../../config/brandConfig';

function Navbar() {
  const { cartItems, openCart } = useCart();
  const location = useLocation();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-brand-cream/95 backdrop-blur-md sticky top-0 z-40 border-b-2 border-yellow-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className="p-2 bg-brand-red rounded-xl text-brand-yellow shadow-md group-hover:scale-105 transition-transform">
              <FireIcon className="h-6 w-6" />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                  {brandConfig.name.toUpperCase()}
                </span>
                <span className="bg-brand-yellow text-brand-dark text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Direct
                </span>
              </div>
              <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest -mt-1 hidden sm:block">
                Ultra Smash Burger
              </span>
            </div>
          </Link>

          {/* Navigation links & Cart action */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link 
              to="/" 
              className={`text-sm font-bold transition-colors ${
                location.pathname === '/' 
                  ? 'text-brand-red border-b-2 border-brand-red pb-1' 
                  : 'text-gray-700 hover:text-brand-red'
              }`}
            >
              Cardápio
            </Link>

            <Link 
              to="/orders" 
              className={`flex items-center gap-1 text-sm font-bold transition-colors ${
                location.pathname.startsWith('/orders') 
                  ? 'text-brand-red border-b-2 border-brand-red pb-1' 
                  : 'text-gray-700 hover:text-brand-red'
              }`}
            >
              <ClockIcon className="w-4 h-4 text-brand-yellow" />
              <span className="hidden sm:inline">Rastrear</span> Pedidos
            </Link>

            <button 
              onClick={openCart} 
              aria-label="Abrir Carrinho"
              className="relative flex items-center gap-2 px-4 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingCartIcon className="h-5 w-5 text-brand-yellow" />
              <span className="text-sm hidden sm:inline">Sacola</span>
              {totalItems > 0 && (
                <span className="bg-brand-yellow text-brand-dark text-xs font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
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
