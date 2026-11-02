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

      {/* 2. Signature Duo Showcase: O Duelo do Balcão */}
      <section id="classicos" className="pt-16 sm:pt-24 pb-12 max-w-[1360px] mx-auto px-5 sm:px-10">
        
        {/* Top Editorial Row: Serif Headline + Subtle Marks */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D71920] font-bold block mb-2">
              01 / OS CAMPEÕES DE PEDIDOS NO BALCÃO
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#141413] leading-none">
              O Duelo do Balcão
            </h2>
          </div>

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

        {/* Side-by-Side Dual Showcase with Center "VS" Badge */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Central Vintage "VS" Floating Badge (desktop centered between cards) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#141413] border-2 border-[#FEDB00] shadow-[0_8px_20px_rgba(0,0,0,0.35)] items-center justify-center pointer-events-none">
            <span className="font-mono font-black text-xs text-[#FEDB00] tracking-widest">VS</span>
          </div>

          {/* Card 1: O Equilíbrio Clássico */}
          <Link
            to="/order"
            className="group relative aspect-[4/4.3] overflow-hidden flex flex-col justify-between p-7 sm:p-10 border border-[#141413]/10"
            style={{
              background: 'radial-gradient(circle at 50% 42%, #F6C927 0%, #C88A14 58%, #3B2306 100%)',
            }}
          >
            <div className="relative z-10 text-center">
              <span className="inline-block bg-[#141413]/80 text-[#FEDB00] font-mono font-bold text-[9px] uppercase tracking-[0.24em] px-2.5 py-1 mb-2">
                O EQUILÍBRIO PURISTA
              </span>
              <h3 className="font-sans font-extrabold text-xl sm:text-2xl uppercase tracking-[0.14em] text-[#141413]">
                Cheese Bacon Clássico
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#141413]/80 mt-1">
                Pão na manteiga &amp; bacon defumado crocante
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
              <span>Duplo 70g • Bacon Artesanal</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">Pedir Clássico ➔</span>
            </div>
          </Link>

          {/* Card 2: O Monstro da Chapa */}
          <Link
            to="/order"
            className="group relative aspect-[4/4.3] overflow-hidden flex flex-col justify-between p-7 sm:p-10 border border-white/10"
            style={{
              background: 'radial-gradient(circle at 50% 44%, #B5161C 0%, #4A090C 62%, #120405 100%)',
            }}
          >
            <div className="relative z-10 text-center">
              <span className="inline-block bg-[#FEDB00] text-[#141413] font-mono font-bold text-[9px] uppercase tracking-[0.24em] px-2.5 py-1 mb-2">
                PESO PESADO DA CHAPA
              </span>
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
              <span>Quádruplo 70g • Fome Extrema</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">Pedir 4-UP ➔</span>
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

            {/* 4. Organic Technical Anatomy Diagram (Floating Centerpiece & Flanking Callouts) */}
      <section id="anatomia" className="py-20 sm:py-28 max-w-[1360px] mx-auto px-5 sm:px-10 overflow-hidden">
        
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#D71920] font-bold block mb-2">
            02 / ANATOMIA DO SMASH • CHAPA DE FERRO
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-[-0.02em] text-[#141413] leading-[1.08]">
            Prensado na Hora com Padrão Obsessivo
          </h2>
          <p className="text-sm sm:text-base text-[#141413]/70 font-sans mt-3 max-w-lg mx-auto leading-relaxed">
            A crosta Maillard perfeita não acontece por acaso. Cada detalhe foi calibrado para entregar a experiência do autêntico smash dos anos 1950.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column (3 Callouts — Aligning towards the center burger) */}
          <div className="lg:col-span-4 space-y-10 lg:text-right">
            
            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  01 / 250°C NA CHAPA
                </span>
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Crosta Maillard Extrema
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                A carne é esmagada nos primeiros segundos na chapa de ferro fundido a 250°C, selando os sucos e gerando bordas ultra rendadas e crocantes.
              </p>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  02 / BLEND EXCLUSIVO
                </span>
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                100% Angus Moído no Dia
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                Zero congelamento e zero conservantes. Apenas cortes frescos selecionados com a proporção exata de gordura e suculência.
              </p>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  03 / VAPOR DA CHAPA
                </span>
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Queijo Fundido no Ponto
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                Fatias generosas de cheddar derretidas diretamente sob abafador sobre a crosta fumegante, envolvendo a carne com cremosidade.
              </p>
            </div>

          </div>

          {/* Center Column: The Pure Floating Burger (No borders, pure cutout, floating with shadow) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-6 order-first lg:order-none">
            
            {/* Ambient Warm Golden Glow behind the patty */}
            <div className="absolute w-64 sm:w-80 h-64 sm:h-80 bg-[#FEDB00]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Smooth Floating Burger Patty (Transparent Cutout) */}
            <motion.div
              animate={{ 
                y: [-8, 8, -8],
                rotate: [-1.2, 1.2, -1.2]
              }}
              transition={{
                repeat: Infinity,
                duration: 5.5,
                ease: 'easeInOut'
              }}
              className="relative z-10 w-64 sm:w-80 md:w-96 aspect-square flex items-center justify-center select-none"
            >
              <img
                src="/images/smash-patty-floating.png"
                alt="Disco Smash Patties Ultra Prensado Flutuando"
                className="w-full h-full object-contain filter drop-shadow-[0_28px_32px_rgba(20,20,19,0.30)] hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Matching Floor Shadow that breathes with the float */}
            <motion.div
              animate={{ 
                scale: [0.85, 1.05, 0.85],
                opacity: [0.22, 0.38, 0.22]
              }}
              transition={{
                repeat: Infinity,
                duration: 5.5,
                ease: 'easeInOut'
              }}
              className="w-48 sm:w-64 h-5 bg-[#141413] rounded-full blur-xl pointer-events-none -mt-3"
            />

            {/* Minimalist Floating Specification Tag */}
            <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2]/80 backdrop-blur-sm border border-[#141413]/15 font-mono text-[9px] uppercase tracking-[0.2em] text-[#141413]/75 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D71920] animate-pulse" />
              <span>DISCO 70G • CROSTA RENDADA A 250°C</span>
            </div>

          </div>

          {/* Right Column (3 Callouts — Aligning towards the center burger) */}
          <div className="lg:col-span-4 space-y-10 lg:text-left">
            
            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2">
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  04 / POTATO BUN
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Pão Selado na Manteiga
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                Potato bun ultra macio dourado na manteiga clarificada, criando uma barreira quente e aveludada que absorve os sucos da chapa.
              </p>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2">
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  05 / RECEITA CLÁSSICA
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Sem Invencionice
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                Flor de sal, picles artesanal crocante, cebola fresca picadinha, ketchup e mostarda clássica dos diners americanos dos anos 50.
              </p>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex items-center gap-2">
                <span className="hidden lg:block w-3 h-[1px] bg-[#D71920]" />
                <span className="font-mono text-[10px] font-bold text-[#D71920] tracking-[0.2em] uppercase">
                  06 / CROCÂNCIA FINA
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#141413] leading-snug">
                Batatas Corte Skinny
              </h3>
              <p className="text-xs sm:text-sm text-[#141413]/70 font-sans leading-relaxed">
                Palitos finíssimos fritos no ponto de ouro para estalar na boca, acompanhada da nossa nhonhonese artesanal de ervas frescas.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Dark Atmospheric Transition: Comandas (Thermal Receipts & Real Reviews) */}
      <section
        id="comandas"
        className="text-[#F5F1E8] pt-20 sm:pt-28 pb-20 sm:pb-28"
        style={{
          background: 'linear-gradient(180deg, #151312 0%, #1E1815 58%, #7C492B 88%, #E4DFD5 100%)',
        }}
      >
        <div className="max-w-[1360px] mx-auto px-5 sm:px-10">
          
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
                src="https://pattiesburger.com/wp-content/uploads/2023/05/2-%E2%80%93-skinny-perfect-fries.jpg"
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
      </section>

      {/* 6. "A Fórmula do Combo Direct" — Step-by-Step Interactive Meal Pipeline */}
      <section className="pt-8 pb-20 sm:pb-28 max-w-[1360px] mx-auto px-5 sm:px-10">
        
        {/* Header Row with Serif Title & Rectangular CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#141413]/20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#D71920] font-bold block mb-2">
              03 / EXPERIÊNCIA COMPLETA NA CHAPA
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-[-0.02em] text-[#141413] leading-tight">
              A Fórmula do Combo Perfeito.
            </h2>
            <p className="text-sm sm:text-base text-[#141413]/70 font-sans mt-2 max-w-lg">
              Em 4 etapas simples você monta o pedido completo como no balcão original do Brooklin.
            </p>
          </div>

          <Link
            to="/order"
            className="self-start sm:self-auto inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#141413] hover:bg-[#D71920] text-[#F5F1E8] font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-colors shadow-lg"
          >
            <span>Montar Combo Completo</span>
            <span>➔</span>
          </Link>
        </div>

        {/* 4 Connected Step Cards in a Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 relative">
          
          {/* Step 1 */}
          <Link
            to="/order?step=0"
            className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#141413]/15 p-5 hover:border-[#141413] transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#D71920] font-bold mb-3 pb-2 border-b border-[#141413]/10">
                <span>ETAPA 01</span>
                <span>O SMASH</span>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-[#141413] mb-4">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2022/04/4-UP-ORINGINAL.jpg"
                  alt="01. Escolha o Smash"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#141413]">
                Escolha a Base
              </h4>
              <p className="text-xs text-[#141413]/70 font-sans mt-1 leading-relaxed">
                Original, Cheese, Bacon ou Monster 4-UP com crosta rendada a 250°C.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#141413]/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]">
              <span className="text-[#141413]/60">A partir de R$ 20</span>
              <span className="font-bold text-[#D71920] group-hover:translate-x-1 transition-transform">Escolher ➔</span>
            </div>
          </Link>

          {/* Step 2 */}
          <Link
            to="/order?step=1"
            className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#141413]/15 p-5 hover:border-[#141413] transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#D71920] font-bold mb-3 pb-2 border-b border-[#141413]/10">
                <span>ETAPA 02</span>
                <span>A CROCÂNCIA</span>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-[#141413] mb-4">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2023/05/1-skinny-classic-fries-1.jpg"
                  alt="02. Batatas Skinny"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#141413]">
                Skinny Fries
              </h4>
              <p className="text-xs text-[#141413]/70 font-sans mt-1 leading-relaxed">
                Corte finíssimo ultra crocante: Classic, Cheddar & Bacon ou Nhonhonese.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#141413]/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]">
              <span className="text-[#141413]/60">A partir de R$ 14</span>
              <span className="font-bold text-[#D71920] group-hover:translate-x-1 transition-transform">Adicionar ➔</span>
            </div>
          </Link>

          {/* Step 3 */}
          <Link
            to="/order?step=2"
            className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#141413]/15 p-5 hover:border-[#141413] transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#D71920] font-bold mb-3 pb-2 border-b border-[#141413]/10">
                <span>ETAPA 03</span>
                <span>O REFRESCANTE</span>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-[#141413] mb-4">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2024/09/refresco-tamarindo.jpg"
                  alt="03. Refrescos da Casa"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#141413]">
                Refresco Natural
              </h4>
              <p className="text-xs text-[#141413]/70 font-sans mt-1 leading-relaxed">
                Receita artesanal servida trincando: Hibiscus com groselha ou Tamarindo cítrico.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#141413]/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]">
              <span className="text-[#141413]/60">A partir de R$ 11</span>
              <span className="font-bold text-[#D71920] group-hover:translate-x-1 transition-transform">Adicionar ➔</span>
            </div>
          </Link>

          {/* Step 4 */}
          <Link
            to="/order?step=2"
            className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#141413]/15 p-5 hover:border-[#141413] transition-all hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#D71920] font-bold mb-3 pb-2 border-b border-[#141413]/10">
                <span>ETAPA 04</span>
                <span>A SOBREMESA</span>
              </div>
              <div className="aspect-[4/3] overflow-hidden bg-[#141413] mb-4">
                <img
                  src="https://pattiesburger.com/wp-content/uploads/2023/05/alteracao-8-%E2%80%93-Milkshake-Pink-1024x982.jpg"
                  alt="04. Shakes Retrô"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#141413]">
                Shakes &amp; Casquinhas
              </h4>
              <p className="text-xs text-[#141413]/70 font-sans mt-1 leading-relaxed">
                Milkshake Blue Retrô, Pink Morango, Baunilha batida ou casquinha crocante.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#141413]/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#141413]">
              <span className="text-[#141413]/60">A partir de R$ 7</span>
              <span className="font-bold text-[#D71920] group-hover:translate-x-1 transition-transform">Adicionar ➔</span>
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
                São Paulo & Belo Horizonte — Chapa quente todos os dias.
              </p>
            </div>

            <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandConfig.stores.map((store, idx) => (
                <div key={idx} className="bg-[#FAF7F2] p-4 border border-[#141413]/15 shadow-sm">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#D71920] block">
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
