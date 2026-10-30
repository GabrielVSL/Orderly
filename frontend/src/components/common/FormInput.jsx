import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const FormInput = ({
  id,
  label,
  icon: Icon,
  as = 'input',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const Tag = as; 

  const baseStyles = "w-full p-3.5 rounded-xl border border-neutral-200/80 focus:border-patties-red transition-all duration-200 bg-white text-neutral-900 placeholder:text-neutral-400 font-bold focus:outline-none shadow-soft focus:shadow-elevated";
  
  const tagStyles = as === 'textarea'
    ? `${baseStyles} resize-none`
    : `${baseStyles} h-12 px-4`;

  return (
    <div>
      <label htmlFor={id} className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-1.5 text-neutral-800">
        {Icon && <Icon className="w-4 h-4 text-patties-red" />}
        {label}
      </label>
      
      <motion.div
        animate={{ scale: isFocused ? 1.005 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <Tag
          id={id}
          className={tagStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </motion.div>
    </div>
  );
};

export default FormInput;
