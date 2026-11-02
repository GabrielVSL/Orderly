import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrderTracking } from '../../context/OrderTrackingContext';
import { 
  UserIcon, 
  ArrowRightOnRectangleIcon, 
  TicketIcon,
  ShoppingCartIcon 
} from '@heroicons/react/24/solid';

export function Navbar() {
  const { cartItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { activeOrder } = useOrderTracking();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isHome = location.pathname === '/';
  const isOrder = location.pathname === '/order';
  const isOrdersList = location.pathname.startsWith('/orders');
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha dropdown ao mudar de rota
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`${
        isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } z-50 transition-all duration-300 ${
        isHome && !scrolled
          ? 'bg-transparent py-5'
          : 'bg-[#141413] shadow-lg py-3.5 border-b border-white/10'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo with Official Mascot */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 group select-none"
            title="Patties Burger - Início"
          >
            <div className="w-9 h-9 rounded-full bg-white p-0.5 border border-white/20 shadow-sm group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src="/images/patties-mascot.png"
                alt="Patties Mascote Oficial"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif font-black text-xl tracking-tight text-white group-hover:text-[#FEDB00] transition-colors uppercase">
              Patties<span className="text-[#FEDB00] font-sans text-xs align-super ml-0.5">®</span>
            </span>
          </Link>
        </div>

        {/* Center: Editorial Clean Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-mono uppercase tracking-[0.2em] text-white/80">
          <Link
            to="/order"
            className={`hover:text-white transition-colors ${isOrder ? 'text-[#FEDB00] font-bold' : ''}`}
          >
            Cardápio
          </Link>
          <a href="/#anatomia" className="hover:text-white transition-colors">
            O Processo
          </a>
          <Link 
            to="/orders" 
            className={`hover:text-white transition-colors ${isOrdersList ? 'text-[#FEDB00] font-bold' : ''}`}
          >
            Comandas
          </Link>
          <a href="/#lojas" className="hover:text-white transition-colors">
            Lojas
          </a>
        </nav>

        {/* Right: Actions Group (Fazer Pedido + Comandas + Carrinho + Login/Perfil) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* 1. Botão Direto para Fazer Pedido (Destaque Principal do Site) */}
          <Link
            to="/order"
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-[0.16em] transition-all hover:scale-[1.02] shadow-sm whitespace-nowrap ${
              isOrder
                ? 'bg-[#FEDB00] text-[#0E132A] ring-2 ring-[#FEDB00]/50'
                : 'bg-[#FEDB00] hover:bg-[#ffe633] text-[#0E132A]'
            }`}
            title="Fazer Pedido no Cardápio"
          >
            <span>Fazer Pedido</span>
            <span className="text-xs">➔</span>
          </Link>

          {/* 2. Minhas Comandas (Sempre abre a lista completa com todos os pedidos) */}
          <Link
            to="/orders"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] transition-colors border ${
              isOrdersList
                ? 'bg-white/15 text-[#FEDB00] font-bold border-white/20'
                : 'text-white/80 hover:text-white hover:bg-white/5 border-white/10'
            }`}
            title="Minhas Comandas (Todos os Meus Pedidos)"
          >
            <TicketIcon className="w-3.5 h-3.5 text-[#FEDB00]" />
            <span className="hidden sm:inline">Comandas</span>
            {activeOrder && activeOrder.status !== 'delivered' && (
              <span className="relative flex h-2 w-2 ml-0.5" title="Pedido em andamento">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
          </Link>

          {/* 3. Carrinho de Compras (Substitui Sacola) */}
          <button
            onClick={openCart}
            aria-label="Abrir Carrinho de Compras"
            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 sm:gap-2 bg-[#D71920] hover:bg-[#b8141a] px-3 sm:px-3.5 py-1.5 shadow-md whitespace-nowrap"
          >
            <ShoppingCartIcon className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Carrinho</span>
            <span className="bg-black/30 text-[#FEDB00] px-1.5 py-0.5 text-[10px] font-bold font-mono">
              {totalItems}
            </span>
          </button>

          {/* 4. Ícone de Conta: Ícone de Pessoa (Logado) ou Símbolo de Login (Deslogado) */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="relative w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 flex items-center justify-center text-[#FEDB00] transition-colors cursor-pointer"
                title={`Conectado como ${user?.name || 'Cliente'} (Clique para opções)`}
                aria-label="Menu da Conta"
              >
                <UserIcon className="w-4 h-4 text-[#FEDB00]" />
                {/* Ponto indicador de status online/conectado */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#141413]" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#141413] border border-white/20 shadow-2xl py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-white/10">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FEDB00] block font-bold">
                      Cliente Patties
                    </span>
                    <span className="font-mono text-xs font-bold text-white block truncate">
                      {user.name}
                    </span>
                    <span className="font-mono text-[9px] text-white/50 block truncate">
                      {user.email}
                    </span>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-white hover:bg-white/10 hover:text-[#FEDB00] transition-colors"
                  >
                    <TicketIcon className="w-4 h-4 text-[#FEDB00]" />
                    <span>Minhas Comandas</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-[#D71920] hover:bg-white/10 transition-colors text-left cursor-pointer border-t border-white/10 mt-1"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Entrar ou Criar Conta"
              aria-label="Entrar na Conta"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;
