import React from 'react';
import { motion } from "framer-motion";
import { AnimatedLogo } from "./common/AnimatedLogo";
import { ArrowDownIcon, SparklesIcon, FireIcon } from "@heroicons/react/24/solid";
import { brandConfig } from '../config/brandConfig';

export const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-cream via-yellow-50/50 to-brand-cream border-b-2 border-yellow-200">
      
      {/* Decorative blurred retro blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-10 left-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-35"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25"
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 z-10 text-center py-16">
        
        {/* Promotion pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/30 border border-brand-yellow text-brand-dark text-xs sm:text-sm font-bold mb-6 shadow-sm"
        >
          <SparklesIcon className="w-4 h-4 text-brand-red animate-pulse" />
          <span>Frete Grátis a partir de R$ 50 • Use o cupom <strong>PATTIES10</strong></span>
        </motion.div>

        {/* Brand name animated */}
        <AnimatedLogo className="text-7xl md:text-9xl mb-4 font-black" />

        {/* Tagline & Slogan */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-4xl font-black text-brand-dark mb-4 tracking-tight"
        >
          {brandConfig.tagline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-base md:text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {brandConfig.slogan}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-red hover:bg-red-700 text-white rounded-full font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <FireIcon className="w-6 h-6 text-brand-yellow" />
            Explorar Cardápio
          </button>
          
          <button
            onClick={scrollToProducts}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/80 hover:bg-white text-brand-dark border-2 border-yellow-300 rounded-full font-bold text-base shadow-sm hover:shadow-md transition-all"
          >
            <ArrowDownIcon className="w-5 h-5 text-brand-red" />
            Combos & Smash
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
