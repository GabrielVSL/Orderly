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

  const baseStyles = "w-full p-3 rounded-xl border-2 border-yellow-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all duration-200 bg-white focus:bg-white text-gray-900 placeholder:text-gray-400";
  
  const tagStyles = as === 'textarea'
    ? `${baseStyles} resize-none`
    : `${baseStyles} h-12 px-4`;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold flex items-center gap-2 mb-1.5 text-brand-dark">
        {Icon && <Icon className="w-4 h-4 text-brand-red" />}
        {label}
      </label>
      
      <motion.div
        animate={{ scale: isFocused ? 1.01 : 1 }}
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
