import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../config/brandConfig';

export const CategoryTabs = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max mx-auto justify-start md:justify-center px-2">
        {brandConfig.categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'text-gray-700 bg-white/80 hover:bg-white hover:text-brand-red border border-yellow-200'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 bg-brand-red rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
