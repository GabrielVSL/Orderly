import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader = ({
  title,
  gradientTitle,
  description,
  className = ''
}) => {
  return (
    <motion.div
      className={`text-center mb-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <h2 className="text-3xl md:text-5xl font-black mb-3 text-brand-dark tracking-tight">
        {title}{' '}
        {gradientTitle && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-yellow">
            {gradientTitle}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
