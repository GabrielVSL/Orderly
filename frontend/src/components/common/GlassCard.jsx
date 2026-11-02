import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', ...props }) => {
  const baseStyle = "bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden";
  
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
