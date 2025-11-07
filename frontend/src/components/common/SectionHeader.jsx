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
      className={`text-center mb-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-5xl font-bold mb-4 text-gray-900">
        {title}{' '}
        {gradientTitle && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">
            {gradientTitle}
          </span>
        )}
      </h2>
      <p className="text-xl text-brand-gray">
        {description}
      </p>
    </motion.div>
  );
};

export default SectionHeader;