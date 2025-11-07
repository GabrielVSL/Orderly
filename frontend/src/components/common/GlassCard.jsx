import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', ...props }) => {
  
  const baseStyle = "bg-white/80 backdrop-blur-md border border-purple-200/50 rounded-3xl shadow-xl overflow-hidden";
  
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