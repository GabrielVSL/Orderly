import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const { cartItems, openCart } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } z-50 transition-all duration-500 ${
        isHome && !scrolled
          ? 'bg-transparent py-5'
          : 'bg-[#141413]/92 backdrop-blur-md py-3.5 border-b border-white/10'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex items-center justify-between">
        
        {/* Left: Crisp Editorial Action Tag (HEIST Style) */}
        <div className="flex items-center gap-4">
          <Link
            to="/order"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.2em] transition-colors"
          >
            Pedir Agora
          </Link>

          {!isHome && (
            <Link
              to="/"
              className="text-white font-serif font-bold text-sm sm:text-base tracking-tight uppercase hidden sm:inline-block hover:opacity-80 transition-opacity"
            >
              Patties®
            </Link>
          )}
        </div>

        {/* Center: Ultra-Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.22em] text-white/85">
          {isHome ? (
            <>
              <a href="#classicos" className="hover:text-white transition-colors">
                Clássicos
              </a>
              <a href="#anatomia" className="hover:text-white transition-colors">
                O Processo
              </a>
              <a href="#comandas" className="hover:text-white transition-colors">
                Comandas
              </a>
              <a href="#lojas" className="hover:text-white transition-colors">
                Lojas
              </a>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-white transition-colors">
                A Marca
              </Link>
              <Link
                to="/order"
                className={`transition-colors ${
                  location.pathname === '/order' ? 'text-[#FEDB00]' : 'hover:text-white'
                }`}
              >
                Montar Pedido
              </Link>
            </>
          )}
          <Link
            to="/orders"
            className={`transition-colors ${
              location.pathname.startsWith('/orders') ? 'text-[#FEDB00]' : 'hover:text-white'
            }`}
          >
            Rastrear
          </Link>
        </nav>

        {/* Right: Minimal Mobile Rastrear + Clean Text Cart Trigger */}
        <div className="flex items-center gap-5">
          <Link
            to="/orders"
            className="md:hidden text-[10px] font-mono uppercase tracking-[0.18em] text-white/80 hover:text-white transition-colors"
          >
            Rastrear
          </Link>

          <button
            onClick={openCart}
            aria-label="Abrir Sacola de Pedidos"
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Sacola</span>
            <span className="text-white/60">({totalItems})</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
