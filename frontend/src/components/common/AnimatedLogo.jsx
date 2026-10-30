import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../config/brandConfig';

export function AnimatedLogo({ className = "", showTagline = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <motion.img 
        src={brandConfig.logoUrl} 
        alt="Patties Burger" 
        className="h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-md mb-2"
        whileHover={{ rotate: [-2, 2, -1, 1, 0], scale: 1.05 }}
        transition={{ duration: 0.4 }}
      />
      {showTagline && (
        <span className="font-script text-patties-red text-xl sm:text-2xl md:text-3xl tracking-wide -mt-2">
          {brandConfig.tagline}
        </span>
      )}
    </motion.div>
  );
}

export default AnimatedLogo;
