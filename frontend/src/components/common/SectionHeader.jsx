import React from 'react';
import { motion } from 'framer-motion';

export const SectionHeader = ({
  subtitle,
  title,
  highlightTitle,
  description,
  className = ''
}) => {
  return (
    <motion.div
      className={`text-center mb-10 ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {subtitle && (
        <p className="font-script text-2xl sm:text-3xl text-patties-red mb-1">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl sm:text-5xl font-black text-patties-charcoal uppercase tracking-tight mb-3">
        {title}{' '}
        {highlightTitle && (
          <span className="text-patties-red underline decoration-patties-yellow decoration-4 underline-offset-4">
            {highlightTitle}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
