import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Button = ({
  as = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseStyle = "w-full flex items-center justify-center font-bold py-4 text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-md";

  const styles = {
    primary: "bg-brand-red hover:bg-red-700 text-white shadow-red-500/20 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none cursor-pointer",
    secondary: "border-2 border-yellow-300 bg-white hover:bg-yellow-50 text-brand-dark hover:border-yellow-400 hover:shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 cursor-pointer",
    accent: "bg-brand-yellow hover:bg-yellow-400 text-brand-dark shadow-yellow-500/20 font-black cursor-pointer"
  };

  const combinedClassName = `${baseStyle} ${styles[variant] || styles.primary} ${className}`;

  const Component = as === 'Link' ? Link : 'button';

  return (
    <motion.div whileHover={{ scale: props.disabled ? 1 : 1.01 }} whileTap={{ scale: props.disabled ? 1 : 0.98 }}>
      <Component className={combinedClassName} {...props}>
        {children}
      </Component>
    </motion.div>
  );
};

export default Button;
