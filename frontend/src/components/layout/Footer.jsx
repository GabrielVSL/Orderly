import React from 'react';
import { Link } from 'react-router-dom';
import { brandConfig } from '../../config/brandConfig';
import { HeartIcon } from '@heroicons/react/24/solid';

export const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 mt-20 border-t-4 border-brand-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-wider text-brand-yellow">
                {brandConfig.name.toUpperCase()}
              </span>
              <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                Direct
              </span>
            </div>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed">
              {brandConfig.slogan}
            </p>
            <p className="text-xs text-yellow-300/80 font-medium">
              ★ {brandConfig.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-brand-yellow font-bold text-sm uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-brand-yellow transition-colors">
                  Cardápio Digital
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-yellow transition-colors">
                  Meus Pedidos & Rastreamento
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-brand-yellow transition-colors">
                  Finalizar Compra
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional / Portfolio notice */}
          <div>
            <h4 className="text-brand-yellow font-bold text-sm uppercase tracking-wider mb-4">
              Projeto Conceitual
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Desenvolvido como case de engenharia fullstack (React + Node.js + PostgreSQL) com isolamento de sessões, cupons e rastreamento.
            </p>
            <span className="inline-block bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-md border border-white/10">
              Homenagem ao Patties Burger
            </span>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} {brandConfig.fullName}. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1">
            Feito com <HeartIcon className="w-4 h-4 text-brand-red inline" /> para o portfólio de engenharia.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
