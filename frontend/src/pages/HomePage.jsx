import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { brandConfig } from '../config/brandConfig';

const Barcode = ({ className = 'h-7' }) => (
  <div
    aria-hidden="true"
    className={`w-full opacity-85 ${className}`}
    style={{
      backgroundImage:
        'repeating-linear-gradient(to right, #141413 0px, #141413 2px, transparent 2px, transparent 4px, #141413 4px, #141413 5px, transparent 5px, transparent 8px, #141413 8px, #141413 11px, transparent 11px, transparent 13px, #141413 13px, #141413 14px, transparent 14px, transparent 17px)',
    }}
  />
);

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#E4DFD5] text-[#141413] selection:bg-[#D71920] selection:text-white">
      
      {/* 1. Cinematic Full-Screen Video Hero */}
      <Hero />

      {/* 2. Signature Duo Showcase (Warm Stone Canvas — HEIST Product Duo Style) */}
      <section id="classicos" className="pt-16 sm:pt-24 pb-12 max-w-[1360px] mx-auto px-5 sm:px-10">
        
        {/* Top Editorial Row: Serif Headline + Subtle Marks */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#141413] leading-none">
            Smash Burgers de Verdade
          </h2>

          <div className="flex flex-wrap items-center gap-6 sm:gap-9 text-[#141413]/55">
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Origem</span>
              <span className="font-serif font-bold text-sm tracking-tight text-[#141413]/80 mt-0.5">BROOKLIN ’19</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Chapa</span>
              <span className="font-mono font-bold text-sm tracking-tight text-[#141413]/80 mt-0.5">250°C FERRO</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Blend</span>
              <span className="font-serif italic text-sm text-[#141413]/80 mt-0.5">100% Angus</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Avaliação</span>
              <span className="font-mono font-bold text-sm text-[#141413]/80 mt-0.5">4.9 ★ (12k+)</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Atmospheric Studio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          
          {/* Card 1: Warm Golden Diner Glow */}
          <Link
            to="/order"
            className="group relative aspect-[4/4.3] overflow-hidden flex flex-col justify-between p-7 sm:p-10"
            style={{
              background: 'radial-gradient(circle at 50% 42%, #F6C927 0%, #C88A14 58%, #3B2306 100%)',
            }}
          >
            <div className="relative z-10 text-center">
              <h3 className="font-sans font-extrabold text-xl sm:text-2xl uppercase tracking-[0.14em] text-[#141413]">
                Cheese Bacon Clássico
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#141413]/80 mt-1">
                Pão na manteiga &amp; crosta caramelizada
              </p>
            </div>

            <div className="relative z-10 my-auto py-4 flex items-center justify-center">
              <div className="relative w-[76%] max-w-[360px] aspect-[4/3] overflow-hidden shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/CHEESEBACON.jpg"
                  alt="Cheese Bacon Patties"
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 bg-[#D71920] text-white font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1">
                  R$ 23,00
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5F1E8]/90">
              <span>Duplo Smash • Bacon Defumado</span>
              <span className="group-hover:translate-x-1 transition-transform">Pedir ➔</span>
            </div>
          </Link>

          {/* Card 2: Deep Crimson Midnight Glow */}
          <Link
            to="/order"
            className="group relative aspect-[4/4.3] overflow-hidden flex flex-col justify-between p-7 sm:p-10"
            style={{
              background: 'radial-gradient(circle at 50% 44%, #B5161C 0%, #4A090C 62%, #120405 100%)',
            }}
          >
            <div className="relative z-10 text-center">
              <h3 className="font-sans font-extrabold text-xl sm:text-2xl uppercase tracking-[0.14em] text-[#F5F1E8]">
                4-UP Monster Smash
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#F5F1E8]/75 mt-1">
                Quatro carnes ultra prensadas &amp; cheddar
              </p>
            </div>

            <div className="relative z-10 my-auto py-4 flex items-center justify-center">
              <div className="relative w-[76%] max-w-[360px] aspect-[4/3] overflow-hidden shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-CHEESEBACON.jpg"
                  alt="4-UP Monster Smash Patties"
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 bg-[#FEDB00] text-[#141413] font-mono font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-1">
                  R$ 37,00
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#F5F1E8]/85">
              <span>Quádruplo Smash • Ícone da Casa</span>
              <span className="group-hover:translate-x-1 transition-transform">Pedir ➔</span>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. Frameless Wide Atmospheric Window (Organic Breathing Space) */}
      <section className="py-12 sm:py-20 max-w-[1360px] mx-auto px-5 sm:px-10">
        <div className="text-center mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#141413]/55">
            Onde tudo começou • Portinha de 2,5m² no Brooklin
          </span>
        </div>

        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-[#141413]">
          <img
            src={brandConfig.storefrontImage}
            alt="Loja original do Patties no Brooklin"
            className="w-full h-full object-cover object-center opacity-90 hover:scale-[1.02] transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between text-[#F5F1E8]">
            <p className="font-serif italic text-base sm:text-xl max-w-md">
              “As filas dobravam o quarteirão por um único motivo: fazer hambúrguer como nos anos 1950.”
            </p>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5F1E8]/80">
              <span className="w-2 h-2 rounded-full bg-[#D71920]" />
              São Paulo, SP
            </span>
          </div>
        </div>
      </section>

      {/* 4. Organic Technical Anatomy Diagram (HEIST Red-Framed Centerpiece + Hairlines) */}
      <section id="anatomia" className="py-16 sm:py-24 max-w-[1220px] mx-auto px-5 sm:px-10">
        
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-20">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#141413] leading-[1.1]">
            Prensado na Hora com Padrão Obsessivo
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hairline Specs */}
          <div className="lg:col-span-4 divide-y divide-[#141413]/20 border-t border-b border-[#141413]/20">
            <div className="py-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Crosta Maillard Extrema
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                Bola de carne esmagada nos primeiros segundos na chapa a 250°C para bordas rendadas e crocantes.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                100% Angus Moído no Dia
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                Zero congelamento e zero conservantes. Apenas cortes frescos com proporção exata de suculência.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Receita Sem Invencionice
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                Flor de sal, picles artesanal da casa, cebola fresca picadinha, ketchup e mostarda clássica.
              </p>
            </div>
          </div>

          {/* Center Red-Bounded Specimen Frame (Exact HEIST Technical Box) */}
          <div className="lg:col-span-4 flex justify-center py-4">
            <div className="relative p-3 border border-[#D71920] bg-[#EAE5DC]">
              {/* Top-right technical red tag */}
              <span className="absolute -top-[1px] -right-[1px] bg-[#D71920] text-white font-mono text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 z-10">
                250°C MAILLARD
              </span>

              {/* Crosshair corner ticks */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-[#D71920]" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-[#D71920]" />

              <div className="w-64 sm:w-72 aspect-[4/5] overflow-hidden bg-[#141413]">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/ORIGINAL.jpg"
                  alt="Anatomia do Original Patties Smash"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="pt-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#141413]/70">
                <span>FIG 01. ULTRA SMASH</span>
                <span>70G / DISCO</span>
              </div>
            </div>
          </div>

          {/* Right Hairline Specs */}
          <div className="lg:col-span-4 divide-y divide-[#141413]/20 border-t border-b border-[#141413]/20">
            <div className="py-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Pão Selado na Manteiga
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                Potato bun ultra macio dourado na manteiga clarificada, criando uma barreira quente e aveludada.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Queijo Fundido no Vapor
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                Fatias generosas de cheddar americano derretidas diretamente sobre a crosta fumegante da carne.
              </p>
            </div>

            <div className="py-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                  Batatas Corte Skinny
                </h3>
                <p className="text-xs sm:text-sm text-[#141413]/70 font-sans mt-1.5 leading-relaxed">
                  Palitos finíssimos estilo diner anos 50, crocância extrema por fora e nhonhonese de ervas.
                </p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 bg-[#F3F0E8] border border-[#141413]/15 px-3 py-2 self-start">
                <span className="w-2 h-2 rounded-full bg-[#D71920]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#141413]/80">
                  Entregue em embalagem térmica ventilada
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Dark Atmospheric Transition: Comandas & Organic Staggered Collage */}
      <section
        id="comandas"
        className="text-[#F5F1E8] pt-20 sm:pt-28 pb-24"
        style={{
          background: 'linear-gradient(180deg, #151312 0%, #1E1815 58%, #7C492B 88%, #E4DFD5 100%)',
        }}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-10">
          
          {/* Part A: "As comandas não mentem." (Thermal Receipts + Visual Frames) */}
          <div className="mb-24 sm:mb-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#F5F1E8]">
                As comandas não mentem.
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5F1E8]/60">
                Mais de 12.000 avaliações • 4.9 Estrelas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Frame 1: Candid Food Frame */}
              <div className="aspect-[3/4] bg-[#1F1C1A] overflow-hidden relative group">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/COMBO-CHEESEBACON.jpg"
                  alt="Combo Cheese Bacon Patties"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">
                  <span>Combo Cheese Bacon</span>
                  <span>★ 5.0</span>
                </div>
              </div>

              {/* Frame 2: Authentic Paper Thermal Receipt #1 */}
              <div className="aspect-[3/4] bg-[#ECE7DD] text-[#141413] p-6 flex flex-col justify-between border border-black/10">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]/60 pb-3 border-b border-dashed border-[#141413]/25">
                    <span>COMANDA #PAT-1094</span>
                    <span>BROOKLIN</span>
                  </div>
                  <div className="py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#141413]/65 space-y-1 border-b border-dashed border-[#141413]/25">
                    <div className="flex justify-between">
                      <span>1X 4-UP CHEESE BACON</span>
                      <span>R$ 37,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1X SKINNY FRIES</span>
                      <span>R$ 16,00</span>
                    </div>
                  </div>
                  <p className="font-serif text-lg sm:text-xl leading-snug text-[#141413] mt-5">
                    “A crostinha da carne parece renda de tão crocante e o pão derrete na boca. Não existe outro smash igual em SP.”
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#141413]/60 mb-2">
                    <span>LUCAS M. • CLIENTE VERIFICADO</span>
                    <span>★★★★★</span>
                  </div>
                  <Barcode className="h-6" />
                </div>
              </div>

              {/* Frame 3: Candid Fries Frame */}
              <div className="aspect-[3/4] bg-[#1F1C1A] overflow-hidden relative group">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2023/05/2---skinny-perfect-fries.jpg"
                  alt="Skinny Perfect Cheddar & Bacon"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">
                  <span>Skinny Perfect Fries</span>
                  <span>★ 5.0</span>
                </div>
              </div>

              {/* Frame 4: Authentic Paper Thermal Receipt #2 */}
              <div className="aspect-[3/4] bg-[#ECE7DD] text-[#141413] p-6 flex flex-col justify-between border border-black/10">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]/60 pb-3 border-b border-dashed border-[#141413]/25">
                    <span>COMANDA #PAT-2418</span>
                    <span>PINHEIROS</span>
                  </div>
                  <div className="py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#141413]/65 space-y-1 border-b border-dashed border-[#141413]/25">
                    <div className="flex justify-between">
                      <span>2X ORIGINAL PATTIES</span>
                      <span>R$ 40,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1X GROSELHA HIBISCUS</span>
                      <span>R$ 12,00</span>
                    </div>
                  </div>
                  <p className="font-serif text-lg sm:text-xl leading-snug text-[#141413] mt-5">
                    “Chegou fervendo em casa. A batata fininha continua sequinha e o refresco de groselha com hibiscus é viciante.”
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#141413]/60 mb-2">
                    <span>BEATRIZ R. • PEDIDO DIRECT</span>
                    <span>★★★★★</span>
                  </div>
                  <Barcode className="h-6" />
                </div>
              </div>

            </div>
          </div>

          {/* Part B: Asymmetric Editorial Statement & Organic Staggered Mosaic */}
          <div>
            <h3 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#F5F1E8] max-w-3xl leading-[1.12] mb-12 sm:mb-16">
              Para a fome de verdade, e para quem sabe que o clássico bem feito supera qualquer moda. Você comanda a chapa.
            </h3>

            {/* Staggered Asymmetric Collage (Different Proportions & Offsets like HEIST) */}
            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6 items-start">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-2 md:col-span-3 aspect-[3/4] overflow-hidden bg-[#141413]"
              >
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/CHEESEBURGUER.jpg"
                  alt="Cheeseburguer Clássico"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-2 aspect-square overflow-hidden bg-[#D71920] p-2 md:mt-6"
              >
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2024/09/refresco-hibiscus.jpg"
                  alt="Refresco de Groselha com Hibiscus"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="col-span-1 md:col-span-2 aspect-square overflow-hidden bg-[#141413] md:mt-36"
              >
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2023/05/1-skinny-classic-fries-1.jpg"
                  alt="Batata Skinny Classic"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="col-span-2 md:col-span-3 aspect-[3/4] overflow-hidden bg-[#141413]"
              >
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8---Milkshake-Blue-1024x982.jpg"
                  alt="Milkshake Blue Retrô"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>

              {/* Subtle Wireframe Architectural Accent Box (Just like HEIST right-edge outline) */}
              <div className="hidden md:flex md:col-span-2 aspect-[3/4] border border-[#141413]/25 p-4 flex-col justify-between text-[#141413]/75 mt-8">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
                  CANAL OFICIAL
                </span>
                <p className="font-serif italic text-base leading-snug">
                  Sem taxas ocultas. Da nossa chapa direto para a sua porta.
                </p>
                <Link
                  to="/order"
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#D71920] hover:underline"
                >
                  Pedir ➔
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. "O Ritual Completo" — 4-Column Guide + Direct CTA (HEIST Bottom Strip Style) */}
      <section className="pt-8 pb-20 sm:pb-28 max-w-[1360px] mx-auto px-5 sm:px-10">
        
        {/* Header Row with Serif Title & Rectangular CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#141413]/20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#141413]/55 block mb-2">
              PASSO A PASSO SEM OBRIGAÇÃO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#141413] leading-tight">
              Para quem leva hambúrguer a sério.
            </h2>
          </div>

          <Link
            to="/order"
            className="self-start sm:self-auto inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#F3EFE6] hover:bg-[#141413] text-[#141413] hover:text-[#F5F1E8] border border-[#141413]/30 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-colors"
          >
            <span>Iniciar Pedido Direct</span>
            <span>➔</span>
          </Link>
        </div>

        {/* 4 Editorial Ritual Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-20">
          
          <Link to="/order?step=0" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-[#141413] mb-3">
              <img
                src="https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-ORINGINAL.jpg"
                alt="01. Escolha o Smash"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-2 border-t border-[#141413]/25 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]">
                01 / O Smash Principal
              </span>
              <span className="font-mono text-[10px] text-[#141413]/50 group-hover:text-[#D71920]">➔</span>
            </div>
          </Link>

          <Link to="/order?step=1" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-[#141413] mb-3">
              <img
                src="https://pattiesburger.com/wp-content/uploads/2023/05/1-skinny-classic-fries-1.jpg"
                alt="02. Batatas Skinny"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-2 border-t border-[#141413]/25 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]">
                02 / Skinny Fries &amp; Bites
              </span>
              <span className="font-mono text-[10px] text-[#141413]/50 group-hover:text-[#D71920]">➔</span>
            </div>
          </Link>

          <Link to="/order?step=2" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-[#141413] mb-3">
              <img
                src="https://pattiesburger.com/wp-content/uploads/2024/09/refresco-tamarindo.jpg"
                alt="03. Refrescos da Casa"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-2 border-t border-[#141413]/25 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]">
                03 / Refrescos Artesanais
              </span>
              <span className="font-mono text-[10px] text-[#141413]/50 group-hover:text-[#D71920]">➔</span>
            </div>
          </Link>

          <Link to="/order?step=2" className="group block">
            <div className="aspect-[4/5] overflow-hidden bg-[#141413] mb-3">
              <img
                src="https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8---Milkshake-Pink-1024x982.jpg"
                alt="04. Shakes Retrô"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="pt-2 border-t border-[#141413]/25 flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#141413]">
                04 / Shakes &amp; Casquinhas
              </span>
              <span className="font-mono text-[10px] text-[#141413]/50 group-hover:text-[#D71920]">➔</span>
            </div>
          </Link>

        </div>

        {/* Minimal Hairline Store Directory (Zero Generic Cards) */}
        <div id="lojas" className="pt-10 border-t border-[#141413]/25">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#141413]/60 block">
                ENDEREÇOS FÍSICOS
              </span>
              <p className="font-serif italic text-lg text-[#141413] mt-1">
                São Paulo — Chapa quente todos os dias.
              </p>
            </div>

            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x sm:divide-[#141413]/15">
              {brandConfig.stores.map((store, idx) => (
                <div key={idx} className={idx > 0 ? 'sm:pl-6' : ''}>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#141413] block">
                    0{idx + 1} / {store.name}
                  </span>
                  <p className="text-xs sm:text-sm text-[#141413]/70 mt-1.5 leading-relaxed">
                    {store.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default HomePage;
