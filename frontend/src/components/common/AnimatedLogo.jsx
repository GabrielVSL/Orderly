import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedLogo({ className = "" }) {
  const letters = "Orderly".split("");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const letter = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex items-center justify-center pointer-events-none ${className}`}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink font-bold inline-block"
          style={{
            textShadow: "0 0 30px rgba(167, 139, 250, 0.5)",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}