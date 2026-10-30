import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../config/brandConfig';

export const CategoryTabs = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max mx-auto justify-start md:justify-center px-2">
        {brandConfig.categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-5 py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'text-white shadow-badge-red'
                  : 'text-neutral-700 bg-white hover:bg-neutral-50 hover:text-patties-red border border-neutral-200/80 shadow-soft'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-patties-red rounded-full shadow-badge-red -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
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
