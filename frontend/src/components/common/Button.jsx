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
  const baseStyle = "w-full flex items-center justify-center font-bold py-4 text-lg rounded-2xl transition-all duration-300";

  const styles = {
    primary: "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:shadow-none",
    secondary: "border-2 border-purple-200/50 bg-white/50 backdrop-blur-sm text-gray-700 hover:border-purple-300 hover:shadow-lg " + 
               "disabled:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-white/50 disabled:border-purple-200/50 disabled:shadow-none"
  };

  const combinedClassName = `${baseStyle} ${styles[variant]} ${className}`;

  const Component = as === 'Link' ? Link : 'button';

  return (
    <motion.div whileHover={{ scale: props.disabled ? 1 : 1.02 }} whileTap={{ scale: props.disabled ? 1 : 0.98 }}>
      <Component className={combinedClassName} {...props}>
        {children}
      </Component>
    </motion.div>
  );
};