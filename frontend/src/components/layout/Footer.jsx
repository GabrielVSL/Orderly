import React from 'react';
import { Link } from 'react-router-dom';
import { brandConfig } from '../../config/brandConfig';

export const Footer = () => {
  return (
    <footer className="bg-[#D71920] text-[#141413] select-none overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-10 sm:pt-14 pb-12">
        
        {/* Giant Full-Width Brand Wordmark (Exact HEIST Footer Proportion) */}
        <div className="w-full overflow-hidden border-b border-[#141413]/20 pb-4 mb-5">
          <h2 className="text-[19vw] sm:text-[18.5vw] font-black tracking-[-0.045em] leading-[0.82] text-[#141413] uppercase font-sans whitespace-nowrap">
            PATTIES<span className="text-[5vw] align-top ml-1 font-bold">®</span>
          </h2>
        </div>

        {/* Single-Row Bold Uppercase Editorial Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#141413] mb-12">
          <Link to="/order" className="hover:opacity-65 transition-opacity">
            Pedir Agora
          </Link>
          <Link to="/#classicos" className="hover:opacity-65 transition-opacity">
            Os Clássicos
          </Link>
          <Link to="/#anatomia" className="hover:opacity-65 transition-opacity">
            O Processo
          </Link>
          <Link to="/#comandas" className="hover:opacity-65 transition-opacity">
            Avaliações
          </Link>
          <Link to="/#lojas" className="hover:opacity-65 transition-opacity">
            Lojas SP
          </Link>
          <Link to="/orders" className="hover:opacity-65 transition-opacity">
            Rastrear Pedido
          </Link>
          <a
            href={brandConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-65 transition-opacity"
          >
            Instagram
          </a>
        </nav>

        {/* Bottom Left Tactile Thermal Ticket Box + Right Brand Note */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          
          {/* Paper Ticket Widget with Barcode (HEIST "Join the Heist" Ticket) */}
          <div className="bg-[#EAE5DC] text-[#141413] p-5 w-full max-w-sm shadow-lg border border-[#141413]/15">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl leading-none text-[#141413]">
                  Direto da Chapa.
                </h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#141413]/65 mt-1">
                  Cupom 10% OFF: <strong>PATTIES10</strong>
                </p>
              </div>
              <span className="font-mono font-bold text-[10px] uppercase tracking-widest border border-[#141413] px-1.5 py-0.5">
                SP • 250°C
              </span>
            </div>

            <Link
              to="/order"
              className="flex items-center justify-between py-2.5 border-b border-[#141413]/40 text-xs font-mono uppercase tracking-[0.18em] text-[#141413] hover:text-[#D71920] transition-colors mb-4"
            >
              <span>Montar meu pedido agora</span>
              <span>➔</span>
            </Link>

            {/* Barcode Graphic */}
            <div
              aria-hidden="true"
              className="w-full h-7 opacity-85"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, #141413 0px, #141413 2px, transparent 2px, transparent 4px, #141413 4px, #141413 5px, transparent 5px, transparent 8px, #141413 8px, #141413 11px, transparent 11px, transparent 13px, #141413 13px, #141413 14px, transparent 14px, transparent 17px)',
              }}
            />
          </div>

          <div className="text-left md:text-right font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]/85 space-y-1">
            <p>Making Burger Like Old Times • Brooklin, Itaim &amp; Pinheiros</p>
            <p className="opacity-70">100% Carne Angus Fresca • Pão Selado na Manteiga</p>
          </div>

        </div>

      </div>

      {/* Bottom Thin Dark Strip */}
      <div className="bg-[#141413] text-[#EAE5DC]/60 py-3 px-5 sm:px-10 text-[10px] font-mono uppercase tracking-[0.18em]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Patties Burger Direct</span>
          <span>São Paulo, Brasil</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
