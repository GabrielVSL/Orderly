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
  const baseStyle = "w-full flex items-center justify-center font-black py-3.5 sm:py-4 text-base uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer";

  const styles = {
    primary: "bg-patties-red hover:bg-patties-red-dark text-white shadow-badge-red hover:shadow-elevated disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed",
    secondary: "bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/80 shadow-soft hover:shadow-elevated disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed",
    accent: "bg-patties-yellow hover:bg-patties-yellow-warm text-neutral-900 shadow-soft hover:shadow-elevated disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:cursor-not-allowed"
  };

  const combinedClassName = `${baseStyle} ${styles[variant] || styles.primary} ${className}`;

  const Component = as === 'Link' ? Link : 'button';

  return (
    <motion.div whileTap={{ scale: props.disabled ? 1 : 0.98 }}>
      <Component className={combinedClassName} {...props}>
        {children}
      </Component>
    </motion.div>
  );
};

export default Button;
