import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', ...props }) => {
  const baseStyle = "bg-white/95 backdrop-blur-md border-2 border-yellow-200/80 rounded-3xl shadow-xl overflow-hidden";
  
  return (
    <motion.div
      className={`${baseStyle} ${className}`}
      {...props} 
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
