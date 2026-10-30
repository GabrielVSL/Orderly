import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../config/brandConfig';

export const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[680px] max-h-[1080px] overflow-hidden flex flex-col justify-between bg-[#141413] text-white select-none">
      
      {/* Background Looping UHD Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={brandConfig.heroImage}
          className="w-full h-full object-cover object-center scale-[1.02] transition-opacity duration-1000"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Atmospheric Editorial Film Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
      </div>

      {/* Top Spacer for Floating Header */}
      <div className="pt-20 relative z-10" />

      {/* Center Phrase */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-xl mx-auto my-auto"
      >
        <span className="w-10 h-[1px] bg-white/40 mb-5" />

        <p className="text-[10px] sm:text-xs font-medium tracking-[0.28em] text-white/90 uppercase leading-[2] font-sans">
          O primeiro smash burger do brasil<br />
          carne ultra prensada na chapa de ferro fundido<br />
          making burger like old times
        </p>

        <span className="w-10 h-[1px] bg-white/40 mt-5" />
      </motion.div>

      {/* Bottom Edge-to-Edge Display Title (Clean, Zero Ugly Strip Below) */}
      <div className="relative z-10 w-full overflow-hidden text-center pb-3 sm:pb-5 px-2 select-none pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="text-[12vw] font-black tracking-[-0.035em] leading-[0.86] text-[#F5F1E8] uppercase font-serif whitespace-nowrap"
        >
          PATTIES BURGER
        </motion.h1>
      </div>

    </section>
  );
};

export default Hero;
