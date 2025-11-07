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

  const baseStyles = "w-full p-3 rounded-xl border-2 border-purple-200/50 focus:border-brand-purple focus:ring-brand-purple transition-all duration-300 bg-white/50 focus:bg-white";
  
  const tagStyles = as === 'textarea'
    ? `${baseStyles} resize-none`
    : `${baseStyles} h-12 px-4`;

  return (
    <div>
      <label htmlFor={id} className="text-base font-semibold flex items-center gap-2 mb-2 text-gray-800">
        {Icon && <Icon className="w-4 h-4 text-brand-purple" />}
        {label}
      </label>
      
      <motion.div
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
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